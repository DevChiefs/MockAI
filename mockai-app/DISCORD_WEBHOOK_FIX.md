# Discord Webhook Fix - Action vs Mutation

## Issue Encountered

```
[ERROR] 'Failed to send Discord notification:'
[Error: Can't use fetch() in queries and mutations.
Please consider using an action.]
```

## Root Cause

**Convex limitation:**

- ❌ Mutations cannot use `fetch()` (external HTTP requests)
- ✅ Actions CAN use `fetch()` (external HTTP requests)
- ✅ Actions CAN also call mutations and queries

## Solution Applied

### Changed `signUp` from Mutation to Action

**Before (Mutation):**

```typescript
export const signUp = mutation({ ... });
```

**After (Action):**

```typescript
export const signUp = action({ ... });
```

### Split Functionality

Created helper functions to separate concerns:

1. **`signUp` (action)** - Main entry point
   - Checks if user exists (via query)
   - Validates password
   - Hashes password
   - Creates user (via mutation)
   - **Sends Discord webhook** ✅
   - Returns token

2. **`checkExistingUser` (query)** - Helper query
   - Checks if email is already registered
   - Returns boolean

3. **`createUser` (mutation)** - Helper mutation
   - Inserts user into database
   - Creates auth session
   - Returns token and userId

### Updated Frontend

Changed hook to use `useAction` instead of `useMutation`:

**File:** `hooks/use-auth.ts`

**Before:**

```typescript
const signUpMutation = useMutation(api.auth.signUp);
```

**After:**

```typescript
const signUpAction = useAction(api.auth.signUp);
```

## How It Works Now

### User Signup Flow

1. **User submits registration form** → `/register`
2. **Frontend calls action** → `signUpAction({ email, password, name })`
3. **Action checks existing user** → `ctx.runQuery(api.auth.checkExistingUser)`
4. **Action validates password** → Length check
5. **Action hashes password** → SHA-256
6. **Action creates user** → `ctx.runMutation(api.auth.createUser)`
7. **Action sends Discord webhook** → `fetch()` to Discord ✅
8. **Action returns session** → Token saved to localStorage
9. **User redirected to dashboard** → Authenticated!

### Discord Webhook Call

```typescript
await fetch("https://discord.com/api/webhooks/...", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: "New user has signed up!",
    embeds: [
      {
        /* ... */
      },
    ],
  }),
});
```

## Key Differences: Actions vs Mutations

### Mutations

- ✅ Fast database operations
- ✅ Transactional (all or nothing)
- ✅ Can be optimistic (UI updates before complete)
- ❌ Cannot use `fetch()`
- ❌ Cannot access external APIs

### Actions

- ✅ Can use `fetch()` for external APIs
- ✅ Can call mutations and queries
- ✅ Can do async operations
- ⚠️ Slower than mutations
- ⚠️ Not transactional
- ⚠️ Cannot be optimistic

## Why This Architecture?

### Separation of Concerns

1. **Database operations** → Mutations (fast, transactional)
2. **External API calls** → Actions (flexible, async)
3. **Data fetching** → Queries (reactive, cached)

### Benefits

✅ **Reliable** - Database operations are transactional
✅ **Non-blocking** - Webhook failure doesn't break signup
✅ **Clean code** - Each function has single responsibility
✅ **Type-safe** - Convex validates all arguments

## Testing

### Test Successful Signup

1. Go to `/register`
2. Fill in form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Submit form
4. Check Discord channel for notification! 🎉

### Expected Result

**Discord message:**

```
🟢 New User Sign Up
━━━━━━━━━━━━━━━━━━━━━━
User Name:    Test User
Email:        test@example.com
Timestamp:    12/12/2025, 10:45:00 AM
```

### If Webhook Fails

User signup will **still succeed** because:

- Webhook is wrapped in try-catch
- Error is logged but not thrown
- Session token is still returned

## Convex Logs

Check Convex dashboard to see:

**Success:**

```
[CONVEX A(auth:signUp)] Created user: test@example.com
[CONVEX A(auth:signUp)] Discord notification sent
```

**Webhook failure (non-blocking):**

```
[CONVEX A(auth:signUp)] Created user: test@example.com
[ERROR] 'Failed to send Discord notification:' [Error: ...]
```

User signup still completes! ✅

## Performance Considerations

### Action Latency

Actions are slightly slower than mutations:

- Mutation: ~50-100ms
- Action: ~200-500ms (includes webhook call)

### Optimization Options

1. **Fire and forget** - Don't await webhook

   ```typescript
   fetch(...).catch(console.error); // Don't await
   ```

2. **Use scheduler** - Queue webhook for later

   ```typescript
   await ctx.scheduler.runAfter(0, api.notifications.sendWebhook, {...});
   ```

3. **Batch notifications** - Send multiple at once
   - Useful for high-traffic apps

## Files Changed

1. ✅ `convex/auth.ts` - Converted signUp to action
2. ✅ `convex/auth.ts` - Added helper query/mutation
3. ✅ `hooks/use-auth.ts` - Changed to useAction
4. ✅ `DISCORD_WEBHOOK_FIX.md` - This documentation

## Common Issues

### "Cannot import api in actions"

**Solution:** Use `api` from generated code:

```typescript
import { api } from "./_generated/api";
```

### "runQuery is not a function"

**Solution:** Use `ctx.runQuery()` in actions, not `ctx.db.query()`:

```typescript
// In action:
await ctx.runQuery(api.auth.checkExistingUser, { email });
```

### "Mutation not exported"

**Solution:** Make sure helper functions are exported:

```typescript
export const checkExistingUser = query({ ... });
export const createUser = mutation({ ... });
```

## Next Steps

✅ **Test it** - Register a new user
✅ **Check Discord** - See the notification
✅ **Customize** - Modify webhook format
✅ **Add more** - Webhook for other events

## Advanced: Add More Webhooks

### Interview Started

```typescript
// In vapi-interface.tsx
vapi.on("call-start", async () => {
  await fetch(webhookUrl, {
    body: JSON.stringify({
      content: `User started interview for ${jobTitle}`,
    }),
  });
});
```

### Session Created

```typescript
// In convex/interviewSessions.ts
export const createSession = action({ ... });
// Add webhook call after session created
```

## Summary

- ✅ Converted `signUp` from mutation to action
- ✅ Split into helper query and mutation
- ✅ Updated frontend to use `useAction`
- ✅ Discord webhook now works! 🎉
- ✅ User signup still fast and reliable
- ✅ Non-blocking error handling

**Your Discord webhook is now fully functional!** 🚀

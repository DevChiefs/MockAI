# Discord Webhook Integration

## What Was Added

Added automatic Discord notifications when new users sign up!

## Implementation

### Location

`convex/auth.ts` - `signUp` mutation

### How It Works

When a new user registers:

1. User account is created in database
2. Discord webhook is called with user details
3. Session is created and returned to user

### Discord Message Format

**Plain text:**

```
New user [Name] with email [email] has signed up!
```

**Rich embed includes:**

- 🟢 Green color (0x00ff00)
- Title: "New User Sign Up"
- Fields:
  - User Name
  - Email
  - Timestamp

### Example Notification

```json
{
  "content": "New user John Doe with email john@example.com has signed up!",
  "embeds": [
    {
      "title": "New User Sign Up",
      "description": "New user John Doe with email john@example.com has signed up!",
      "color": 65280,
      "fields": [
        { "name": "User Name", "value": "John Doe" },
        { "name": "Email", "value": "john@example.com" },
        { "name": "Timestamp", "value": "12/12/2025, 10:30:00 AM" }
      ]
    }
  ]
}
```

## Key Features

### ✅ Non-Blocking

The webhook is wrapped in a try-catch block. If Discord is down or the webhook fails:

- Error is logged to console
- User signup continues normally
- User gets their session token

### ✅ Handles Missing Data

- If no name is provided: Shows "Unknown" or "Not provided"
- Email is always required (enforced by schema)

### ✅ Secure

- Webhook URL is hardcoded in backend (not exposed to client)
- Only fires on successful user creation
- No sensitive data (passwords) are sent

## Webhook URL

```
https://discord.com/api/webhooks/1448864797939470460/miRHTnXpb6JX58hZ4lrZMzN_CVvVlDxxLde-T5gmHRMOCZr3Rk8ne-Kv2njU8xAtRO2Y
```

**Note:** This webhook is embedded in the code. If you need to change it:

1. Edit `convex/auth.ts`
2. Update the webhook URL in the `fetch()` call
3. Convex will auto-deploy the change

## Testing

### Test User Signup

1. **Register a new user:**

   ```
   http://localhost:3000/register
   ```

2. **Fill in the form:**
   - Name: Test User
   - Email: test@example.com
   - Password: password123

3. **Check Discord:**
   - Should see notification in your webhook channel
   - Should show user details

### If Webhook Doesn't Fire

**Check browser console:**

```javascript
// Should NOT see this error:
"Failed to send Discord notification: ...";
```

**If you see the error:**

- Webhook URL might be invalid
- Discord might be down
- Network issue

**User signup will still work!** The webhook is non-blocking.

## Discord Channel Setup

### Create Webhook (If Needed)

1. Go to Discord server
2. Right-click channel → Edit Channel
3. Integrations → Webhooks → New Webhook
4. Copy webhook URL
5. Replace URL in `convex/auth.ts`

### Customize Notification

Edit the webhook body in `convex/auth.ts`:

**Change color:**

```typescript
color: 0x00ff00; // Green
color: 0x0099ff; // Blue
color: 0xff0000; // Red
color: 0xffaa00; // Orange
```

**Add more fields:**

```typescript
fields: [
  { name: "User Name", value: args.name || "Not provided" },
  { name: "Email", value: args.email },
  { name: "Timestamp", value: new Date().toLocaleString() },
  { name: "User ID", value: userId }, // Add this
  { name: "Source", value: "MockAI Web" }, // Add this
];
```

**Add emoji:**

```typescript
content: `🎉 New user ${args.name} has signed up!`;
```

## Security Considerations

### ✅ Safe to Include

- User name (public info)
- Email (user provided it)
- Timestamp (public info)

### ⚠️ Never Include

- ❌ Password or password hash
- ❌ Session tokens
- ❌ Internal user IDs (unless needed)

## Advanced: Move to Environment Variable

For better security, move webhook to `.env.local`:

1. **Add to `.env.local`:**

   ```env
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
   ```

2. **Update `convex/auth.ts`:**
   ```typescript
   const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
   if (webhookUrl) {
     await fetch(webhookUrl, {
       /* ... */
     });
   }
   ```

**Note:** Convex doesn't support process.env directly. You'd need to use Convex environment variables:

```bash
npx convex env set DISCORD_WEBHOOK_URL "https://..."
```

Then access in code:

```typescript
// In a Convex action (not mutation)
const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
```

## Limitations

### Current Implementation

- Only fires on **new user signups**
- Does not fire on:
  - User login
  - Session creation
  - User deletion
  - Profile updates

### To Add More Notifications

**User login notification:**
Add to `signIn` mutation in `convex/auth.ts`

**Session created notification:**
Add to `createSession` in `convex/interviewSessions.ts`

**Interview started notification:**
Add to interview page when Vapi call starts

## Troubleshooting

### No Discord Notification

1. **Check Convex logs:**
   - Open Convex dashboard
   - View function logs for `auth:signUp`
   - Look for "Failed to send Discord notification"

2. **Test webhook manually:**

   ```bash
   curl -X POST "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"content": "Test message"}'
   ```

3. **Verify webhook is active:**
   - Go to Discord server settings
   - Check webhook still exists
   - Webhook URLs expire if deleted

### Webhook Rate Limiting

Discord limits webhooks to:

- **30 requests per minute**
- **1 request per second**

If you expect high signup volume, consider:

- Batching notifications
- Using a queue system
- Reducing notification frequency

## Example Discord Message

When Test User signs up:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
New user Test User with email test@example.com has signed up!

📋 New User Sign Up
New user Test User with email test@example.com has signed up!

User Name:    Test User
Email:        test@example.com
Timestamp:    12/12/2025, 10:30:00 AM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Next Steps

1. ✅ **Test it**: Register a new user and check Discord
2. 🎨 **Customize**: Change colors, emoji, fields
3. 🔒 **Secure**: Move webhook to environment variable
4. 📊 **Expand**: Add notifications for other events

Your Discord webhook is ready! Every new signup will trigger a notification. 🎉

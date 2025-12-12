# Vapi Call End Fix - AI Keeps Speaking Issue

## Issue

After ending the call, the AI speaking animation and status continued showing "AI is speaking..." even though the call had ended.

## Root Cause

The `isAISpeaking` state was not being reset when the call ended. The state changes were:

**What was being reset:**

- ✅ `isConnected` → false
- ✅ `isMuted` → false
- ✅ `callRef` → null
- ✅ `status` → "Interview ended"

**What was missing:**

- ❌ `isAISpeaking` → false (not being reset!)

This caused the speaking animation (pulsing waves, green glow) to continue indefinitely.

## Solution

Added `setIsAISpeaking(false)` to two places:

### 1. Event Handler: `call-end`

**Location:** `vapi-interface.tsx` ~line 79

**Before:**

```typescript
vapi.on("call-end", () => {
  callRef.current = null;
  setIsConnected(false);
  setStatus("Interview ended");
  setIsMuted(false);
  // ... update session status
});
```

**After:**

```typescript
vapi.on("call-end", () => {
  callRef.current = null;
  setIsConnected(false);
  setIsAISpeaking(false); // ✅ Stop AI speaking animation
  setStatus("Interview ended");
  setIsMuted(false);
  // ... update session status
});
```

### 2. Button Handler: `handleEndCall`

**Location:** `vapi-interface.tsx` ~line 230

**Before:**

```typescript
const handleEndCall = () => {
  if (vapiRef.current && isConnected) {
    vapiRef.current.stop();
    callRef.current = null;
    setIsConnected(false);
    setIsMuted(false);
    setStatus("Interview ended");
    // ... redirect to dashboard
  }
};
```

**After:**

```typescript
const handleEndCall = () => {
  if (vapiRef.current && isConnected) {
    vapiRef.current.stop();
    callRef.current = null;
    setIsConnected(false);
    setIsAISpeaking(false); // ✅ Stop AI speaking immediately
    setIsMuted(false);
    setStatus("Interview ended");
    // ... redirect to dashboard
  }
};
```

## Why Two Places?

### 1. Event Handler (`call-end`)

Handles when:

- Call ends naturally
- Call drops due to error
- Connection is lost
- Vapi server ends the call

### 2. Button Handler (`handleEndCall`)

Handles when:

- User clicks "End Interview" button
- Immediate UI feedback before event fires
- Ensures instant state cleanup

## Visual Changes

### Before Fix

When clicking "End Interview":

```
┌──────────────────────────────┐
│  🟢 [Pulsing waves continue] │  ← BUG!
│                              │
│  "AI is speaking..."         │  ← Wrong!
│                              │
│  [End Interview] ← Clicked   │
└──────────────────────────────┘
```

### After Fix

When clicking "End Interview":

```
┌──────────────────────────────┐
│  ⚪ [No animation]            │  ← Fixed!
│                              │
│  "Interview ended"           │  ← Correct!
│                              │
│  Returning to dashboard...   │
└──────────────────────────────┘
```

## State Reset Checklist

When call ends, all these states are now properly reset:

- ✅ `isConnected` → `false`
- ✅ `isAISpeaking` → `false` (NOW FIXED!)
- ✅ `isMuted` → `false`
- ✅ `callRef.current` → `null`
- ✅ `status` → `"Interview ended"`
- ✅ Session updated to `"completed"`
- ✅ Redirect to dashboard (2s delay)

## Testing

### Test Scenario 1: End While AI Speaking

1. Start interview
2. Wait for AI to start speaking (see pulsing waves)
3. Click "End Interview" immediately
4. **Expected:** Animation stops instantly
5. **Expected:** Status changes to "Interview ended"
6. **Expected:** Redirects to dashboard after 2s

### Test Scenario 2: End While User Speaking

1. Start interview
2. Wait for your turn to speak
3. Click "End Interview"
4. **Expected:** Clean end, no speaking animation
5. **Expected:** Status changes to "Interview ended"
6. **Expected:** Redirects to dashboard after 2s

### Test Scenario 3: Natural Call End

1. Complete full interview
2. Let AI end the interview naturally
3. **Expected:** Animation stops
4. **Expected:** Status changes to "Interview ended"
5. **Expected:** Session marked as completed

## Related Components

### Voice Animation UI

The `isAISpeaking` state controls:

**Pulsing waves:**

```tsx
{
  isAISpeaking && isConnected && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute w-40 h-40 rounded-full border-2 border-green-400/30 animate-ping" />
      {/* More waves... */}
    </div>
  );
}
```

**Mic icon scaling:**

```tsx
<Mic className={`w-12 h-12 ${isAISpeaking ? "scale-110" : ""}`} />
```

**Audio bars:**

```tsx
<AudioWaveform
  className={`${isAISpeaking ? "text-green-400 animate-pulse" : ""}`}
/>
```

## Event Flow

### Complete Call End Flow

```
User clicks "End Interview"
         ↓
handleEndCall() executes
         ↓
1. vapiRef.current.stop() ← Tells Vapi to end
2. callRef.current = null ← Clear call object
3. setIsConnected(false) ← Update UI
4. setIsAISpeaking(false) ← ✅ Stop animation
5. setIsMuted(false) ← Reset mute
6. setStatus("Interview ended") ← Update status
         ↓
Vapi fires "call-end" event
         ↓
call-end handler executes
         ↓
1. callRef.current = null (redundant, but safe)
2. setIsConnected(false) (redundant, but safe)
3. setIsAISpeaking(false) ← ✅ Ensure stopped
4. setStatus("Interview ended") (redundant)
5. setIsMuted(false) (redundant)
6. Update session status to "completed"
         ↓
2 second delay
         ↓
router.push("/dashboard")
         ↓
User sees dashboard
```

## Why Redundancy is Good

Both places set `isAISpeaking(false)` because:

1. **Button click** → Immediate UI feedback
2. **Event handler** → Handles all end scenarios (not just button clicks)
3. **Safety** → Even if one fails, the other ensures cleanup
4. **Edge cases** → Call might end before button handler completes

## Common Issues Fixed

### Issue: Animation persists

**Cause:** `isAISpeaking` not reset
**Fixed:** ✅ Now resets in both places

### Issue: Can't start new call

**Cause:** State not cleaned up
**Fixed:** ✅ All states properly reset

### Issue: UI shows wrong status

**Cause:** Speaking animation overrides status text
**Fixed:** ✅ Animation stops, correct status shows

## Performance Impact

**Minimal:**

- One extra state update (`setIsAISpeaking(false)`)
- No performance degradation
- Cleaner, more predictable state management

## Files Changed

1. ✅ `app/interview/[sessionId]/_components/vapi-interface.tsx`
   - Updated `call-end` event handler
   - Updated `handleEndCall` function
2. ✅ `VAPI_CALL_END_FIX.md` - This documentation

## Summary

- ✅ Fixed AI speaking animation continuing after call end
- ✅ Added `setIsAISpeaking(false)` to event handler
- ✅ Added `setIsAISpeaking(false)` to button handler
- ✅ Both manual and automatic call endings now work correctly
- ✅ All UI states properly reset when interview ends

**The AI will no longer appear to be speaking after the call ends!** 🎯✨

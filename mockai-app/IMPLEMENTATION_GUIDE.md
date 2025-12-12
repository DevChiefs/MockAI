# MockAI Interview Sessions - Implementation Guide

## Overview

This implementation adds a complete AI-powered interview session management system to MockAI, including:

- **Dashboard**: View, create, and manage interview sessions
- **Session Creation**: Upload resume (PDF) and specify job title
- **Voice Interviews**: Conduct realistic interview practice using Vapi AI
- **Session Management**: Track session status (pending, in_progress, completed)

## Architecture

### Backend (Convex)

#### Database Schema

- **authSessions**: Renamed from `sessions` - stores authentication tokens
- **interviewSessions**: Stores interview practice sessions with job details and resume text
- **users**: Existing user authentication table

#### Functions

- **`convex/pdfProcessor.ts`**: Processes PDF resumes to extract text
- **`convex/interviewSessions.ts`**: CRUD operations for interview sessions
- **`convex/auth.ts`**: Updated to use `authSessions` table

### Frontend (Next.js)

#### Pages

- **`/dashboard`**: Main dashboard showing all user sessions
- **`/interview/[sessionId]`**: Interview practice page with Vapi integration
- **`/login`**: Login page (updated to redirect to dashboard)
- **`/register`**: Registration page (updated to redirect to dashboard)

#### Components

- **`ProtectedRoute`**: HOC for authentication protection
- **`CreateSessionModal`**: Modal for creating new sessions
- **`VapiInterface`**: Voice interface component using Vapi SDK

## Setup Instructions

### 1. Install Dependencies

**Important**: If you encounter permission errors with npm, fix node_modules ownership first:

```bash
cd mockai-app

# Fix ownership (if needed)
sudo chown -R $(whoami) node_modules

# Install dependencies
npm install @vapi-ai/web pdf-parse
npm install -D @types/pdf-parse
```

### 2. Deploy Convex Schema Changes

The schema has been updated with:

- Renamed `sessions` to `authSessions`
- Added new `interviewSessions` table

Convex will automatically detect and apply these changes when you run the dev server.

```bash
npm run dev
```

### 3. Set Up Vapi

Follow the detailed guide in **`VAPI_SETUP.md`** to:

1. Create a Vapi account
2. Get your API keys
3. Create an assistant
4. Configure environment variables

Create a `.env.local` file:

```env
# Vapi Configuration
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id_here
```

### 4. Test the Implementation

1. **Start the dev server**:

   ```bash
   npm run dev
   ```

2. **Test the flow**:
   - Register or login → redirects to `/dashboard`
   - Create a new session with job title and PDF resume
   - Wait for PDF processing (should take 1-3 seconds)
   - Click on session to go to interview page
   - Click "Start Interview" to begin voice practice
   - Use mute/unmute and end interview controls

## Features

### Dashboard

- ✅ View all interview sessions in card layout
- ✅ Color-coded status badges (pending, in_progress, completed)
- ✅ Delete sessions with confirmation
- ✅ Create new session button
- ✅ Empty state for first-time users
- ✅ Session sorting by creation date (newest first)

### Session Creation

- ✅ Job title input with validation
- ✅ PDF file upload (max 5MB)
- ✅ File type validation (PDF only)
- ✅ Real-time PDF to text conversion
- ✅ Loading states during processing
- ✅ Error handling with user-friendly messages
- ✅ Auto-redirect to interview page after creation

### Interview Page

- ✅ Protected route (authentication required)
- ✅ Session validation (user ownership check)
- ✅ Vapi voice interface integration
- ✅ Start/stop interview controls
- ✅ Mute/unmute microphone
- ✅ Real-time connection status
- ✅ Auto-update session status (pending → in_progress → completed)
- ✅ Interview tips for users
- ✅ Return to dashboard after interview

## Technical Details

### PDF Processing

PDFs are processed server-side using the `pdf-parse` library:

- Client uploads PDF as base64
- Convex action processes PDF to extract text
- Text is stored in database (no file storage needed)
- Typical processing time: 1-3 seconds for standard resumes

### Vapi Integration

The interview uses Vapi for voice interaction:

- **Client-side SDK**: `@vapi-ai/web` for browser integration
- **Dynamic instructions**: Resume text and job title injected at runtime
- **Real-time events**: Call start, end, speech detection
- **Status updates**: Session status synced with call state

### Authentication Flow

```
Login/Register → Dashboard → Create Session → Interview Page
                    ↑                              ↓
                    └──────── End Interview ───────┘
```

All authenticated routes use the `ProtectedRoute` component which:

- Checks authentication status
- Redirects to login if not authenticated
- Shows loading state during auth check

## API Reference

### Convex Functions

#### `processPdfToText(pdfBase64: string)`

Converts PDF to text using pdf-parse.

**Returns**:

```typescript
{
  success: boolean;
  text: string;
  numPages: number;
  error?: string;
}
```

#### `createSession(token: string, jobTitle: string, resumeText: string)`

Creates a new interview session.

**Returns**:

```typescript
{
  success: boolean;
  sessionId: Id<"interviewSessions">;
  error?: string;
}
```

#### `getUserSessions(token: string)`

Gets all sessions for authenticated user, sorted by creation date.

#### `getSession(token: string, sessionId: Id<"interviewSessions">)`

Gets a specific session (with ownership verification).

#### `deleteSession(token: string, sessionId: Id<"interviewSessions">)`

Deletes a session (with ownership verification).

#### `updateSessionStatus(token, sessionId, status, vapiSessionId?)`

Updates session status and optional Vapi session ID.

## File Structure

```
mockai-app/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                          # Dashboard page
│   │   └── _components/
│   │       └── create-session-modal.tsx      # Session creation modal
│   ├── interview/
│   │   └── [sessionId]/
│   │       ├── page.tsx                      # Interview page
│   │       └── _components/
│   │           └── vapi-interface.tsx        # Vapi voice interface
│   ├── login/
│   │   └── _components/
│   │       └── login-form.tsx                # Updated redirect
│   └── register/
│       └── _components/
│           └── register-form.tsx             # Updated redirect
├── components/
│   └── protected-route.tsx                   # Auth protection HOC
├── convex/
│   ├── schema.ts                             # Updated schema
│   ├── auth.ts                               # Updated auth functions
│   ├── pdfProcessor.ts                       # PDF processing action
│   └── interviewSessions.ts                  # Session CRUD functions
├── VAPI_SETUP.md                             # Vapi setup guide
└── IMPLEMENTATION_GUIDE.md                   # This file
```

## Known Issues & Limitations

### 1. Node Modules Permissions

The node_modules folder may be owned by root. To fix:

```bash
sudo chown -R $(whoami) node_modules
```

### 2. Vapi Assistant Configuration

Currently using inline assistant configuration. For production:

- Create a permanent assistant in Vapi dashboard
- Use the assistant ID instead of dynamic configuration
- This provides better control and consistency

### 3. PDF Size Limit

Maximum PDF size is 5MB. Larger files will be rejected.

### 4. Browser Compatibility

Voice features require modern browsers with WebRTC support:

- ✅ Chrome 70+
- ✅ Edge 79+
- ✅ Firefox 70+
- ✅ Safari 14+

## Future Enhancements

### Short-term

- [ ] Store interview transcripts from Vapi
- [ ] Add interview duration tracking
- [ ] Session pagination for users with many sessions
- [ ] Export session data as PDF report

### Medium-term

- [ ] Interview analytics and performance metrics
- [ ] Multiple resume versions per user
- [ ] Custom interview question sets
- [ ] Practice history and improvement tracking

### Long-term

- [ ] Video interview practice with webcam
- [ ] AI-powered feedback and scoring
- [ ] Interview scheduling and reminders
- [ ] Team/company interview preparation

## Troubleshooting

### "Session not found" error

- Verify you're logged in with the correct account
- Check that the session ID in the URL is valid
- Ensure the session wasn't deleted

### PDF processing fails

- Check file size (must be < 5MB)
- Ensure file is a valid PDF
- Try a different PDF if the file might be corrupted
- Check browser console for detailed errors

### Voice interface not working

- See detailed troubleshooting in `VAPI_SETUP.md`
- Verify environment variables are set
- Check microphone permissions in browser
- Restart dev server after changing env variables

### Dashboard shows "Loading sessions..." forever

- Check browser console for errors
- Verify Convex is connected (check network tab)
- Ensure auth token is valid (try logging out and back in)

## Support

For issues or questions:

1. Check the console for error messages
2. Review `VAPI_SETUP.md` for Vapi-specific issues
3. Verify all environment variables are set correctly
4. Ensure dependencies are installed properly

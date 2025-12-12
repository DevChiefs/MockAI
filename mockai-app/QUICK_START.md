# Quick Start Guide

Get your AI Interview Practice system up and running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- Convex account (already configured)
- Vapi account (you'll set this up)

## Step 1: Install Dependencies (2 minutes)

Fix node_modules permissions if needed:

```bash
cd mockai-app
sudo chown -R $(whoami) node_modules
```

Install new dependencies:

```bash
npm install @vapi-ai/web pdf-parse
npm install -D @types/pdf-parse
```

## Step 2: Set Up Vapi (3 minutes)

1. **Create Vapi account**: Go to [vapi.ai](https://vapi.ai) and sign up

2. **Get your Public Key**:
   - In Vapi dashboard → Settings → API Keys
   - Copy the Public Key

3. **Create an Assistant**:
   - Vapi dashboard → Assistants → Create New
   - Name: "MockAI Interview Coach"
   - Model: GPT-4 or GPT-3.5-turbo
   - Voice: 11Labs - Rachel (or any voice you prefer)
   - Copy the Assistant ID

4. **Set Environment Variables**:
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_public_key_here
   NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id_here
   ```

## Step 3: Start the Server

```bash
npm run dev
```

## Step 4: Test It Out!

1. Open [http://localhost:3000](http://localhost:3000)
2. Login or register (you'll be redirected to dashboard)
3. Click "Create New Session"
4. Enter a job title (e.g., "Software Engineer")
5. Upload a PDF resume
6. Wait for processing, then start your interview!

## Troubleshooting

### Permission denied when installing

```bash
sudo chown -R $(whoami) node_modules
npm install @vapi-ai/web pdf-parse
```

### "Vapi public key not configured"

- Make sure `.env.local` exists in `mockai-app/` folder
- Restart dev server after adding environment variables

### Microphone not working

- Allow microphone permissions when prompted
- Use Chrome or Edge for best compatibility

## What's New?

✅ Dashboard page at `/dashboard`
✅ Create interview sessions with resume upload
✅ AI-powered voice interviews using Vapi
✅ Session management (view, delete sessions)
✅ Automatic PDF to text conversion
✅ Session status tracking

## Need Help?

- See `VAPI_SETUP.md` for detailed Vapi configuration
- See `IMPLEMENTATION_GUIDE.md` for full technical details
- Check browser console for error messages

## Quick Test Checklist

- [ ] Can create a session with PDF upload
- [ ] PDF processes successfully (1-3 seconds)
- [ ] Can start voice interview
- [ ] Can hear AI speaking
- [ ] Can mute/unmute microphone
- [ ] Can end interview
- [ ] Session status updates correctly
- [ ] Can delete sessions

If all checks pass, you're ready to go! 🎉

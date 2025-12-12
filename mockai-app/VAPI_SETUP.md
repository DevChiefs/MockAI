# Vapi Setup Guide

This guide will help you set up Vapi for AI-powered voice interviews in MockAI.

## Step 1: Create a Vapi Account

1. Go to [https://vapi.ai](https://vapi.ai)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your API Keys

1. Log in to your Vapi dashboard
2. Navigate to **Settings** or **API Keys**
3. Copy your **Public Key** (starts with `vapi_public_...`)
4. You'll need this for the environment variables

## Step 3: Create an Assistant

1. In your Vapi dashboard, go to **Assistants**
2. Click **Create New Assistant**
3. Configure the assistant with these settings:

### Basic Settings

- **Name**: MockAI Interview Coach
- **Voice Provider**: 11Labs
- **Voice**: Rachel (or choose your preferred voice)

### Model Configuration

- **Model Provider**: OpenAI
- **Model**: gpt-4 (or gpt-3.5-turbo for lower costs)

### System Prompt Template

```
You are an AI interview coach conducting a professional job interview.

Your role:
1. Ask relevant interview questions based on the job requirements
2. Listen carefully to the candidate's responses
3. Provide constructive feedback after each answer
4. Ask follow-up questions to dive deeper into their experience
5. Keep the interview professional and encouraging

Start by greeting the candidate and asking them to briefly introduce themselves.
```

**Note**: The actual job title and resume text will be dynamically injected at runtime through the API.

4. Save the assistant and copy its **Assistant ID**

## Step 4: Configure Environment Variables

1. In your project root (`mockai-app`), create a `.env.local` file (or copy from `.env.local.example`)
2. Add the following variables:

```env
# Vapi Configuration
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id_here
```

Replace the placeholder values with your actual keys from steps 2 and 3.

## Step 5: Install Dependencies

If you have permission issues with npm, you may need to fix the ownership of node_modules:

```bash
# Option 1: Fix ownership (requires sudo)
cd mockai-app
sudo chown -R $(whoami) node_modules

# Then install dependencies
npm install @vapi-ai/web pdf-parse
npm install -D @types/pdf-parse
```

OR

```bash
# Option 2: Install with proper permissions
cd mockai-app
npm install @vapi-ai/web pdf-parse
npm install -D @types/pdf-parse
```

## Step 6: Test Your Setup

1. Start your development server:

```bash
npm run dev
```

2. Log in to MockAI
3. Create a new interview session with a job title and resume PDF
4. Click on the session to start the interview
5. Click "Start Interview" - you should be able to speak with the AI

## Troubleshooting

### "Vapi public key not configured" error

- Make sure `.env.local` exists in the `mockai-app` directory
- Ensure the variable name is exactly `NEXT_PUBLIC_VAPI_PUBLIC_KEY`
- Restart your dev server after adding environment variables

### "Failed to initialize voice interface" error

- Check that your Vapi account is active
- Verify your API key is valid (try regenerating it in the dashboard)
- Check browser console for detailed error messages

### Microphone not working

- Ensure you've granted microphone permissions to your browser
- Check that your microphone is working in other applications
- Try using Chrome or Edge (best browser support for WebRTC)

### No audio from AI

- Check your computer's volume settings
- Verify the voice provider (11Labs) is properly configured in your assistant
- Try a different voice if the current one isn't working

## Advanced Configuration

### Custom Assistant Behavior

To customize how the AI conducts interviews, you can:

1. Modify the assistant's system prompt in the Vapi dashboard
2. Adjust the assistant's temperature (higher = more creative, lower = more focused)
3. Add custom instructions for specific interview types

### Cost Optimization

- Use `gpt-3.5-turbo` instead of `gpt-4` for lower costs
- Use alternative voice providers (PlayHT, Azure) instead of 11Labs
- Set conversation limits in your Vapi dashboard

## Resources

- [Vapi Documentation](https://docs.vapi.ai)
- [Vapi Web SDK Reference](https://docs.vapi.ai/sdk/web)
- [OpenAI Models Pricing](https://openai.com/pricing)
- [11Labs Voice Library](https://elevenlabs.io/voice-library)

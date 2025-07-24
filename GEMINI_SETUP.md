# Gemini AI Integration Setup

## Overview
The Hands of Hope chatbot now uses Google's Gemini AI to provide intelligent, contextual responses about the organization. The integration uses a server-side API route to securely handle the Gemini API calls.

## Architecture
- **Frontend**: React component makes API calls to `/api/chat`
- **Backend**: Next.js API route handles Gemini AI requests securely
- **Security**: API key is only used on the server side

## Setup Instructions

### 1. Get Your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Navigate to the API keys section
4. Create a new API key
5. Copy the API key (it will look something like: `AIzaSyC...`)

### 2. Configure the API Key
1. Open the `.env.local` file in your project root
2. Replace `YOUR_API_KEY_HERE` with your actual Gemini API key:

```env
GEMINI_API_KEY=AIzaSyC...your_actual_api_key_here
```

### 3. Restart the Development Server
After adding the API key, restart your development server:

```bash
npm run dev
```

## Features

### AI-Powered Responses
- The chatbot now uses Gemini 2.5 Flash model
- Provides contextual, accurate information about Hands of Hope
- Handles complex questions about the organization
- Falls back gracefully if API is unavailable

### Context-Aware
The AI has been trained with comprehensive information about:
- Organization mission and vision
- All branches and locations
- Leadership structure
- Programs and activities
- Partners and sponsors
- Impact statistics

### Security Features
- API key is only used on the server side
- No client-side exposure of sensitive credentials
- Proper error handling and validation
- Rate limiting and request validation

### Error Handling
- Graceful fallback if API key is missing
- Error handling for network issues
- User-friendly error messages
- Server-side logging for debugging

## Testing the Integration

1. Start the development server
2. Navigate to any page (home, about, branches, contact, crew, donate)
3. Click the floating chat button in the bottom-right corner
4. Ask questions like:
   - "Tell me about Hands of Hope"
   - "What branches do you have?"
   - "How can I volunteer?"
   - "Who are the founders?"

## Troubleshooting

### API Key Issues
- Ensure the API key is correctly copied to `.env.local`
- Check that the file is in the project root directory
- Restart the development server after adding the key
- Verify the API key has proper permissions in Google AI Studio

### Network Issues
- The chatbot will show a fallback message if the API is unavailable
- Check your internet connection
- Verify the API key has proper permissions
- Check browser console for any network errors

### Development Issues
- Check the browser console for error messages
- Check the server logs for API route errors
- Ensure all dependencies are installed: `npm install`
- Clear browser cache if needed

## Security Notes
- Never commit your API key to version control
- The `.env.local` file is already in `.gitignore`
- Keep your API key secure and don't share it publicly
- The API key is only used server-side for security

## Cost Considerations
- Gemini API has usage-based pricing
- Monitor your usage in Google AI Studio
- Consider setting up usage limits if needed
- API calls are made server-side, so you can implement rate limiting

## API Route Details
The chatbot uses `/api/chat` route which:
- Validates incoming requests
- Securely handles the Gemini API key
- Returns formatted responses
- Includes proper error handling
- Logs errors for debugging 
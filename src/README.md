
# HealthStack Application

## Environment Setup

This application requires certain environment variables to function correctly. Follow these steps to set up your environment:

1. Create a `.env` file in the root directory of the project
2. Copy the contents from `.env.example` to your `.env` file
3. Replace the placeholder values with your actual API keys and configuration

Example:
```
VITE_SUPABASE_URL=https://your-actual-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
VITE_ENABLE_AI_FEATURES=true
```

**IMPORTANT:** Never commit your `.env` file to version control as it may contain sensitive information.

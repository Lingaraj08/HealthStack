
/**
 * Environment variable constants
 */

// Common environment variables
export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  ENABLE_AI_FEATURES: true,
  GOOGLE_API_KEY: 'AIzaSyDxlNEzzRycm3rCDNtQEl2zFuiA9U47MrI',
  GOOGLE_CLIENT_ID: '578857887844-k6drs17ou5kagepbao9l391ms7t03rni.apps.googleusercontent.com',
  UPI_ID: '8431632044-2@ybl',
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '' // Add this for AI chatbot
};

// AI response configuration
export const AI_CONFIG = {
  USE_ENHANCED_RESPONSES: true,
  TEMPERATURE: 0.7,  // Controls randomness: lower is more deterministic
  MAX_TOKENS: 500,   // Maximum length of response
  API_KEY_AVAILABLE: Boolean(ENV.GEMINI_API_KEY || ENV.GOOGLE_API_KEY),
};

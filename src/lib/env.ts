
/**
 * Environment variable constants
 */

// Common environment variables
export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  ENABLE_AI_FEATURES: true,
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyDxlNEzzRycm3rCDNtQEl2zFuiA9U47MrI',
};

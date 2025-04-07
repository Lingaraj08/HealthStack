
/**
 * Environment variable validation utility
 */

// Get an environment variable with validation
export function getEnvVariable(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  
  if (!value && defaultValue !== undefined) {
    console.warn(`Environment variable ${key} not found, using default value`);
    return defaultValue;
  }
  
  if (!value) {
    console.error(`Environment variable ${key} is required but not defined`);
    return '';
  }
  
  return value as string;
}

// Common environment variables
export const ENV = {
  SUPABASE_URL: getEnvVariable('VITE_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVariable('VITE_SUPABASE_ANON_KEY'),
  ENABLE_AI_FEATURES: getEnvVariable('VITE_ENABLE_AI_FEATURES', 'true') === 'true',
};

/**
 * Check if all required environment variables are defined
 */
export function validateEnvVariables(): { valid: boolean; missing: string[] } {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

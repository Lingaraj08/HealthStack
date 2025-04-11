
import { ENV } from '@/lib/env';

export const supabaseConfig = {
  url: ENV.SUPABASE_URL,
  anonKey: ENV.SUPABASE_ANON_KEY,
};

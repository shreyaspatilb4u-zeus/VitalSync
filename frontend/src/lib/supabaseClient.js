import { createClient } from '@supabase/supabase-js';
import { config } from './config';

/**
 * Supabase Client Instance
 * Initialized exclusively with the public anon key.
 * Never use or reference a service_role key on the client.
 * If credentials are missing or invalid, exports null safely to allow demo-only mode.
 */
let client = null;

if (config.isSupabaseConfigured && config.supabaseUrl && config.supabaseAnonKey) {
  try {
    client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch {
    // If initialization fails for any reason, fall back to null safely
    client = null;
  }
}

export const supabase = client;
export default supabase;

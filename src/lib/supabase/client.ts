import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createSbBrowserClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );

// Completely anonymous client - no cookies, no session state
export const createAnonymousClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false, // No session persistence
      autoRefreshToken: false, // No token refresh
      detectSessionInUrl: false // No URL session detection
    }
  });
};

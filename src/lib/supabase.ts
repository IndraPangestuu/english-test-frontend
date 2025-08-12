import { createClient } from '@supabase/supabase-js';
export type { SupabaseClient } from '@supabase/supabase-js';
export type { User } from '@supabase/supabase-js';

// Pastikan sudah set di file .env.local
// VITE_SUPABASE_URL="https://xxxx.supabase.co"
// VITE_SUPABASE_ANON_KEY="your-anon-key"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

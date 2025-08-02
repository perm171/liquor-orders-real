import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Use this in server components (e.g., page.tsx) to create a Supabase client.
 */
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

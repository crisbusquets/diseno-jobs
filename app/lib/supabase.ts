// app/lib/supabase.ts
import { createClient as supabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function getSupabase() {
  return supabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
}

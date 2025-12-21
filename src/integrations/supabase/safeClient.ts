import { createClient } from "@supabase/supabase-js";

// Some remixed/deployed environments can intermittently miss Vite-injected env vars.
// We keep a safe fallback so the app never boots with an undefined supabaseUrl.
const FALLBACK_SUPABASE_URL = "https://vrpbhguztsqakvjcezeb.supabase.co";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycGJoZ3V6dHNxYWt2amNlemViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyOTczNzcsImV4cCI6MjA4MTg3MzM3N30._RMAZAKoGsk9xmHAXCvITf8BW4f52WyHYdhJq4IEW4Y";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL) as string;
const SUPABASE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_SUPABASE_PUBLISHABLE_KEY) as string;

// NOTE: We intentionally use an untyped client here because this project does not ship
// database table types (Database.public.Tables is `never`).
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

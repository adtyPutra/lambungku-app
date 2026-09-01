import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://izxkdvtgqpiaomtlmjfd.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6eGtkdnRncXBpYW9tdGxtamZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNTU1NjUsImV4cCI6MjEwMzczMTU2NX0.gCNM5IS_yKkSpfhjqxwLqN-9kpEFipFvnG5Qss6Lla0';

if (!supabaseKey && typeof window !== 'undefined') {
  console.warn('Supabase Anon Key is missing. Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

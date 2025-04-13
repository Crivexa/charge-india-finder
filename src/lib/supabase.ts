
import { createClient } from '@supabase/supabase-js'

// Use the provided Supabase URL and API key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rlnoqzhnqkhoejduvzxb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbm9xemhucWtob2VqZHV2enhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NzA1NDAsImV4cCI6MjA2MDE0NjU0MH0.WH6y4KSRDVNDAqiUEYcSh9QROEgA1QcWHgchrA10GsM';

// Check if we're in development mode
if (import.meta.env.DEV && 
    (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('Using hardcoded Supabase configuration. For proper customization, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a function to check if Supabase is configured properly
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey;
};

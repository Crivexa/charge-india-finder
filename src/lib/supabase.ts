
import { createClient } from '@supabase/supabase-js'

// For development purposes, we'll provide fallback values
// In production, these should be set as environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key';

// Check if we're in development mode and using the fallback values
if (import.meta.env.DEV && 
    (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('Using development fallback values for Supabase. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for proper configuration.');
  
  // Add specific instructions for the user
  if (supabaseUrl.includes('your-supabase-project-url')) {
    console.error('⚠️ IMPORTANT: Replace the placeholder Supabase URL in src/lib/supabase.ts with your actual Supabase project URL.');
  }
  
  if (supabaseAnonKey.includes('your-public-anon-key')) {
    console.error('⚠️ IMPORTANT: Replace the placeholder Supabase anon key in src/lib/supabase.ts with your actual public anon key.');
  }
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a function to check if Supabase is configured properly
export const isSupabaseConfigured = () => {
  return !supabaseUrl.includes('your-supabase-project-url') && 
         !supabaseAnonKey.includes('your-public-anon-key');
};

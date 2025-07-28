import { createClient } from '@supabase/supabase-js';

// Supabase configuration for admin operations (bypasses RLS)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Missing Supabase service role key - dev dashboard will have limited functionality');
  // Fallback to anonymous client with limited access
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseAnonKey) {
    throw new Error('Missing both service role and anonymous Supabase keys');
  }
  
  // Export the anonymous client as fallback
  export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
} else {
  // Create admin client that bypasses RLS for analytics
  export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

// Export types for use in components
export type SupabaseAdminClient = typeof supabaseAdmin;
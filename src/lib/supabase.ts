import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if real Supabase credentials are configured
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey !== 'your-supabase-anon-key-here'
);

// Fallback stub client if not configured to prevent runtime crashes
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key');

export const getCloudConnectionInfo = () => {
  return {
    isConfigured: isSupabaseConfigured,
    url: isSupabaseConfigured ? supabaseUrl.replace(/https:\/\/(.*)\.supabase\.co.*/, '$1.supabase.co') : 'Cloud In-Memory (Zero-Config Demo)',
    status: isSupabaseConfigured ? 'Connected to PostgreSQL Edge' : 'Local Cloud Sandbox Active',
  };
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Improved check to prevent crash on invalid/placeholder URLs
const isValidUrl = (url: string) => {
  try {
    return url && url.startsWith('http') && !url.includes('your_supabase_url');
  } catch {
    return false;
  }
};

export const supabase = isValidUrl(supabaseUrl) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

/**
 * Service role client for server-side operations that bypass RLS
 */
export const supabaseAdmin = isValidUrl(supabaseUrl) && supabaseServiceKey && !supabaseServiceKey.includes('your_supabase_')
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null as any;

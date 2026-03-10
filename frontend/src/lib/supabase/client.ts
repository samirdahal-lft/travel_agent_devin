/**
 * Supabase client for browser-side usage.
 */

import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL_PLACEHOLDER = 'https://placeholder.supabase.co';
const SUPABASE_KEY_PLACEHOLDER = 'placeholder-key';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL_PLACEHOLDER;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_KEY_PLACEHOLDER;
  return createBrowserClient(url, key);
}

/**
 * Returns true if Supabase is properly configured with real credentials.
 */
export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== SUPABASE_URL_PLACEHOLDER
  );
}

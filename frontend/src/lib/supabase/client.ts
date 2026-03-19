/**
 * Supabase client for browser-side usage.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to be
 * set in .env.local. Copy .env.local.example and fill in your Supabase
 * project credentials.
 */

import { createBrowserClient } from '@supabase/ssr';

/**
 * Returns true if Supabase is properly configured with real credentials.
 */
export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During build/prerender, env vars may be absent. Log a warning to the
    // console so developers notice, but don't throw — that would break the
    // Next.js build.  At runtime in the browser the missing config will
    // surface as a failed Supabase request with a clear console message.
    const msg =
      'Missing Supabase configuration. ' +
      'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local. ' +
      'See .env.local.example for reference.';

    if (typeof window !== 'undefined') {
      // In the browser — throw so the user gets a visible error instead of
      // silently hitting a non-existent placeholder URL.
      throw new Error(msg);
    }

    // Server-side / build-time — warn but return a stub client so the build
    // can finish.  Auth calls will fail gracefully (no session found).
    console.warn(msg);
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  }

  return createBrowserClient(url, key);
}

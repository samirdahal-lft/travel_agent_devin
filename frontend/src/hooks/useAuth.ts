/**
 * Custom hook for managing authentication state via the FastAPI backend.
 *
 * Auth tokens and user info are persisted in localStorage and a cookie so
 * that the Next.js middleware can gate protected routes.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { login as apiLogin, signup as apiSignup } from '@/services/auth';
import { AuthUser } from '@/types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const TOKEN_COOKIE = 'auth_token';

function persistAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

function loadAuth(): { token: string | null; user: AuthUser | null } {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem(USER_KEY);
  const user = raw ? (JSON.parse(raw) as AuthUser) : null;
  return { token, user };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const { token, user: storedUser } = loadAuth();
    if (token && storedUser) {
      setAccessToken(token);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    const authUser: AuthUser = { id: res.user_id, email: res.email };
    persistAuth(res.access_token, authUser);
    setAccessToken(res.access_token);
    setUser(authUser);
    return res;
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const res = await apiSignup({ email, password });
    // If the backend returns an access_token, persist the session.
    // Some Supabase projects require email verification before issuing a
    // token, so the token may be empty.
    if (res.access_token) {
      const authUser: AuthUser = { id: res.user_id, email: res.email };
      persistAuth(res.access_token, authUser);
      setAccessToken(res.access_token);
      setUser(authUser);
    }
    return res;
  }, []);

  const signOut = useCallback(() => {
    clearAuth();
    setUser(null);
    setAccessToken(null);
  }, []);

  return { user, loading, accessToken, login, signup, signOut };
}

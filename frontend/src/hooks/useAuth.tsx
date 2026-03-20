/**
 * Custom hook for managing authentication state via the FastAPI backend.
 *
 * Auth tokens and user info are persisted in localStorage and a cookie so
 * that the Next.js middleware can gate protected routes.
 *
 * State is shared across all components via React context so that the
 * Navbar (and any other consumer) re-renders immediately when the user
 * logs in, signs up, or signs out.
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { login as apiLogin, signup as apiSignup } from '@/services/auth';
import { AuthResponse, AuthUser } from '@/types';

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

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
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

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, accessToken, login, signup, signOut }),
    [user, loading, accessToken, login, signup, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}

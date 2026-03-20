/**
 * Authentication service for signup and login via the FastAPI backend.
 */

import { apiRequest } from './api';
import { AuthResponse, LoginRequest, SignupRequest } from '@/types';

/**
 * Register a new user.
 */
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>({
    method: 'POST',
    path: '/auth/signup',
    body: data as unknown as Record<string, unknown>,
  });
}

/**
 * Login an existing user.
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>({
    method: 'POST',
    path: '/auth/login',
    body: data as unknown as Record<string, unknown>,
  });
}

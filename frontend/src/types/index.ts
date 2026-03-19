/**
 * TypeScript type definitions for the Travel Agent AI application.
 */

// ============================================================
// Auth Types
// ============================================================

export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

// ============================================================
// Travel Types
// ============================================================

export interface TravelQueryRequest {
  query: string;
}

export interface Source {
  title: string;
  url: string;
}

export interface TravelPlanResponse {
  conversation_id: string;
  query: string;
  plan: string;
  sources: Source[];
  created_at: string;
}

export interface ConversationHistory {
  id: string;
  query: string;
  response: string;
  sources: Source[];
  created_at: string;
}

export interface HistoryResponse {
  conversations: ConversationHistory[];
}

// ============================================================
// API Types
// ============================================================

export interface ApiError {
  detail: string;
}

export interface HealthResponse {
  status: string;
  version: string;
}

// ============================================================
// UI Types
// ============================================================

export interface FormFieldError {
  field: string;
  message: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

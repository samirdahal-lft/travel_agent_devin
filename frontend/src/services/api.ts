/**
 * Base API service for making HTTP requests to the FastAPI backend.
 *
 * Handles authentication headers, error parsing, and request/response logging.
 */

import clientLogger from '@/logger/client-logger';
import { ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  body?: Record<string, unknown>;
  token?: string;
}

/**
 * Make an authenticated API request to the backend.
 */
export async function apiRequest<T>(options: RequestOptions): Promise<T> {
  const { method, path, body, token } = options;
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  clientLogger.info(`API Request: ${method} ${path}`, {
    method,
    path,
    hasBody: !!body,
    hasToken: !!token,
  });

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        detail: `Request failed with status ${response.status}`,
      }));

      clientLogger.error(`API Error: ${method} ${path}`, {
        status: response.status,
        detail: errorData.detail,
      });

      throw new ApiRequestError(errorData.detail, response.status);
    }

    const data = await response.json();

    clientLogger.info(`API Response: ${method} ${path}`, {
      status: response.status,
    });

    return data as T;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    clientLogger.error(`API Network Error: ${method} ${path}`, { error: message });
    throw new ApiRequestError(message, 0);
  }
}

/**
 * Custom error class for API request failures.
 */
export class ApiRequestError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

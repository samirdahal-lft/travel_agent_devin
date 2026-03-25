/**
 * Unit tests for the API service layer.
 */

import { apiRequest, ApiRequestError } from '@/services/api';

// Mock client logger
jest.mock('@/logger/client-logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('apiRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('makes a successful GET request', async () => {
    const mockData = { status: 'healthy', version: '1.0.0' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
      status: 200,
    });

    const result = await apiRequest({ method: 'GET', path: '/health' });
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/health'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('makes a successful POST request with body and token', async () => {
    const mockResponse = { access_token: 'token123', user_id: 'user1' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
      status: 200,
    });

    const result = await apiRequest({
      method: 'POST',
      path: '/auth/login',
      body: { email: 'test@test.com', password: 'pass123' },
      token: 'bearer-token',
    });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer bearer-token',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('throws ApiRequestError on HTTP error response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ detail: 'Invalid credentials' }),
    });

    await expect(
      apiRequest({ method: 'POST', path: '/auth/login', body: { email: 'a', password: 'b' } })
    ).rejects.toThrow(ApiRequestError);

    try {
      await apiRequest({ method: 'POST', path: '/auth/login', body: { email: 'a', password: 'b' } });
    } catch (error) {
      expect(error).toBeInstanceOf(ApiRequestError);
      expect((error as ApiRequestError).status).toBe(401);
      expect((error as ApiRequestError).message).toBe('Invalid credentials');
    }
  });

  it('throws ApiRequestError on network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network failure'));

    await expect(
      apiRequest({ method: 'GET', path: '/health' })
    ).rejects.toThrow(ApiRequestError);
  });
});

/**
 * Unit tests for the useTravelPlan hook.
 */

import { renderHook, act } from '@testing-library/react';
import { useTravelPlan } from '@/hooks/useTravelPlan';
import * as travelService from '@/services/travel';

jest.mock('@/services/travel');

const mockCreateTravelPlan = travelService.createTravelPlan as jest.MockedFunction<
  typeof travelService.createTravelPlan
>;

describe('useTravelPlan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts with idle state', () => {
    const { result } = renderHook(() => useTravelPlan());
    expect(result.current.loadingState).toBe('idle');
    expect(result.current.plan).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('sets loading state when generating plan', async () => {
    mockCreateTravelPlan.mockResolvedValue({
      conversation_id: '123',
      query: 'test',
      plan: 'Test plan',
      created_at: '2024-01-01',
    });

    const { result } = renderHook(() => useTravelPlan());

    await act(async () => {
      await result.current.generatePlan('Plan a trip to Bali', 'token123');
    });

    expect(result.current.loadingState).toBe('success');
    expect(result.current.plan).toBeTruthy();
    expect(result.current.plan?.plan).toBe('Test plan');
  });

  it('sets error state on failure', async () => {
    mockCreateTravelPlan.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTravelPlan());

    await act(async () => {
      await result.current.generatePlan('test query', 'token123');
    });

    expect(result.current.loadingState).toBe('error');
    expect(result.current.error).toBeTruthy();
  });

  it('resets state correctly', async () => {
    mockCreateTravelPlan.mockResolvedValue({
      conversation_id: '123',
      query: 'test',
      plan: 'Test plan',
      created_at: '2024-01-01',
    });

    const { result } = renderHook(() => useTravelPlan());

    await act(async () => {
      await result.current.generatePlan('test query', 'token123');
    });

    expect(result.current.plan).toBeTruthy();

    act(() => {
      result.current.reset();
    });

    expect(result.current.plan).toBeNull();
    expect(result.current.loadingState).toBe('idle');
    expect(result.current.error).toBeNull();
  });
});

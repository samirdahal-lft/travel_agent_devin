/**
 * Custom hook for generating travel plans.
 */

'use client';

import { useState } from 'react';
import { createTravelPlan } from '@/services/travel';
import { TravelPlanResponse, LoadingState } from '@/types';
import { ApiRequestError } from '@/services/api';

export function useTravelPlan() {
  const [plan, setPlan] = useState<TravelPlanResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (query: string, token: string) => {
    setLoadingState('loading');
    setError(null);
    setPlan(null);

    try {
      const result = await createTravelPlan(query, token);
      setPlan(result);
      setLoadingState('success');
      return result;
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : 'An unexpected error occurred while generating the travel plan.';
      setError(message);
      setLoadingState('error');
      return null;
    }
  };

  const reset = () => {
    setPlan(null);
    setLoadingState('idle');
    setError(null);
  };

  return { plan, loadingState, error, generatePlan, reset };
}

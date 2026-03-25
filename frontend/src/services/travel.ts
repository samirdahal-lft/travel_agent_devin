/**
 * Travel service for interacting with travel plan endpoints.
 */

import { apiRequest } from './api';
import { TravelPlanResponse, HistoryResponse } from '@/types';

/**
 * Generate a travel plan based on a user query.
 */
export async function createTravelPlan(
  query: string,
  token: string
): Promise<TravelPlanResponse> {
  return apiRequest<TravelPlanResponse>({
    method: 'POST',
    path: '/travel/plan',
    body: { query },
    token,
  });
}

/**
 * Fetch the authenticated user's travel plan history.
 */
export async function getTravelHistory(token: string): Promise<HistoryResponse> {
  return apiRequest<HistoryResponse>({
    method: 'GET',
    path: '/travel/history',
    token,
  });
}

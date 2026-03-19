/**
 * Custom hook for fetching travel history.
 */

'use client';

import { useCallback, useState } from 'react';
import { getTravelHistory } from '@/services/travel';
import { ConversationHistory, LoadingState } from '@/types';
import { ApiRequestError } from '@/services/api';

export function useTravelHistory() {
  const [conversations, setConversations] = useState<ConversationHistory[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (token: string) => {
    setLoadingState('loading');
    setError(null);

    try {
      const result = await getTravelHistory(token);
      setConversations(result.conversations);
      setLoadingState('success');
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : 'Failed to fetch travel history.';
      setError(message);
      setLoadingState('error');
    }
  }, []);

  return { conversations, loadingState, error, fetchHistory };
}

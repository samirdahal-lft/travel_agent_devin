/**
 * Travel History page - shows past travel plans.
 */

'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTravelHistory } from '@/hooks/useTravelHistory';
import HistoryList from '@/components/travel/HistoryList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import { History } from 'lucide-react';

export default function HistoryPage() {
  const { user, loading: authLoading, accessToken } = useAuth();
  const { conversations, loadingState, error, fetchHistory } = useTravelHistory();

  useEffect(() => {
    if (accessToken) {
      fetchHistory(accessToken);
    }
  }, [accessToken, fetchHistory]);

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  if (!user) {
    return null; // Middleware handles redirect
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center gap-3">
        <History className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Travel History</h1>
          <p className="mt-1 text-gray-600">
            View your past travel plans and itineraries.
          </p>
        </div>
      </div>

      {/* Error State */}
      {loadingState === 'error' && error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loadingState === 'loading' && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" message="Loading your travel history..." />
        </div>
      )}

      {/* History List */}
      {loadingState === 'success' && (
        <HistoryList conversations={conversations} />
      )}
    </div>
  );
}

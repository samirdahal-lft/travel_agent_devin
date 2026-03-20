/**
 * Travel Planner Dashboard - main authenticated page for creating travel plans.
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTravelPlan } from '@/hooks/useTravelPlan';
import TravelQueryForm from '@/components/travel/TravelQueryForm';
import TravelPlanDisplay from '@/components/travel/TravelPlanDisplay';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user, loading: authLoading, accessToken } = useAuth();
  const { plan, loadingState, error, generatePlan, reset } = useTravelPlan();

  const handleSubmit = async (query: string) => {
    if (!accessToken) return;
    await generatePlan(query, accessToken);
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Travel Planner</h1>
        <p className="mt-2 text-gray-600">
          Describe your dream trip and let AI create a personalized travel plan
          for you.
        </p>
      </div>

      {/* Show plan result or query form */}
      {plan && loadingState === 'success' ? (
        <TravelPlanDisplay plan={plan} onNewPlan={reset} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <TravelQueryForm
            onSubmit={handleSubmit}
            isLoading={loadingState === 'loading'}
            error={error}
          />

          {/* Loading State with helpful message */}
          {loadingState === 'loading' && (
            <div className="mt-8 rounded-lg bg-blue-50 p-6 text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-sm font-medium text-blue-900">
                Generating your personalized travel plan...
              </p>
              <p className="mt-1 text-xs text-blue-700">
                This may take a minute as we search for real-time travel
                information and create your itinerary.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

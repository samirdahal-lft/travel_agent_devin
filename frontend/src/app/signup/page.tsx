/**
 * Signup page.
 */

import { Suspense } from 'react';
import { Plane } from 'lucide-react';
import SignupForm from '@/components/auth/SignupForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export const metadata = {
  title: 'Sign Up - TravelAgent AI',
  description: 'Create your TravelAgent AI account and start planning trips.',
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Plane className="mx-auto h-10 w-10 text-blue-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Start planning AI-powered trips in seconds
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <Suspense fallback={<LoadingSpinner message="Loading..." />}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

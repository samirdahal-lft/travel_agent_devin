/**
 * Login page.
 */

import { Suspense } from 'react';
import { Plane } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export const metadata = {
  title: 'Log In - TravelAgent AI',
  description: 'Log in to your TravelAgent AI account.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Plane className="mx-auto h-10 w-10 text-blue-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Log in to continue planning your trips
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <Suspense fallback={<LoadingSpinner message="Loading..." />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

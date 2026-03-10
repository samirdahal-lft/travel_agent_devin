/**
 * Login form component with validation and error handling.
 */

'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import { validateLoginForm } from '@/utils/validation';
import { FormFieldError } from '@/types';
import clientLogger from '@/logger/client-logger';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormFieldError[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const getFieldError = (field: string): string | undefined =>
    errors.find((e) => e.field === field)?.message;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validateLoginForm(email, password);
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    setIsLoading(true);
    clientLogger.info('Login attempt', { email });

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        clientLogger.error('Login failed', { error: error.message });
        setServerError(error.message);
        return;
      }

      clientLogger.info('Login successful', { email });
      router.push(redirect);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      clientLogger.error('Login error', { error: message });
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={getFieldError('email')}
        autoComplete="email"
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={getFieldError('password')}
        autoComplete="current-password"
        required
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        Log In
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-700">
          Sign up
        </Link>
      </p>
    </form>
  );
}

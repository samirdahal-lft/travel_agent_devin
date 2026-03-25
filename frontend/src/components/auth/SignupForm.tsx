/**
 * Signup form component with validation and error handling.
 */

'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import { validateSignupForm } from '@/utils/validation';
import { FormFieldError } from '@/types';
import clientLogger from '@/logger/client-logger';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormFieldError[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getFieldError = (field: string): string | undefined =>
    errors.find((e) => e.field === field)?.message;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const validationErrors = validateSignupForm(email, password, confirmPassword);
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    setIsLoading(true);
    clientLogger.info('Signup attempt', { email });

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        clientLogger.error('Signup failed', { error: error.message });
        setServerError(error.message);
        return;
      }

      clientLogger.info('Signup successful', { email });
      setSuccessMessage(
        'Account created successfully! Please check your email to verify your account, then log in.'
      );

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      clientLogger.error('Signup error', { error: message });
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {serverError && <Alert variant="error">{serverError}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

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
        placeholder="At least 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={getFieldError('password')}
        autoComplete="new-password"
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Repeat your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={getFieldError('confirmPassword')}
        autoComplete="new-password"
        required
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
          Log in
        </Link>
      </p>
    </form>
  );
}

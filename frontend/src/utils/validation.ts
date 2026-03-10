/**
 * Form validation utilities.
 */

import { FormFieldError } from '@/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

export function validateTravelQuery(query: string): string | null {
  if (!query.trim()) {
    return 'Please enter a travel query';
  }
  if (query.trim().length < 10) {
    return 'Query must be at least 10 characters';
  }
  if (query.trim().length > 1000) {
    return 'Query must be less than 1000 characters';
  }
  return null;
}

export function validateLoginForm(email: string, password: string): FormFieldError[] {
  const errors: FormFieldError[] = [];
  const emailError = validateEmail(email);
  if (emailError) errors.push({ field: 'email', message: emailError });
  const passwordError = validatePassword(password);
  if (passwordError) errors.push({ field: 'password', message: passwordError });
  return errors;
}

export function validateSignupForm(
  email: string,
  password: string,
  confirmPassword: string
): FormFieldError[] {
  const errors: FormFieldError[] = [];
  const emailError = validateEmail(email);
  if (emailError) errors.push({ field: 'email', message: emailError });
  const passwordError = validatePassword(password);
  if (passwordError) errors.push({ field: 'password', message: passwordError });
  const confirmError = validateConfirmPassword(password, confirmPassword);
  if (confirmError) errors.push({ field: 'confirmPassword', message: confirmError });
  return errors;
}

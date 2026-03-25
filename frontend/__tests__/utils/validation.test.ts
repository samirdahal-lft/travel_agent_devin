/**
 * Unit tests for validation utilities.
 */

import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateTravelQuery,
  validateLoginForm,
  validateSignupForm,
} from '@/utils/validation';

describe('validateEmail', () => {
  it('returns error for empty email', () => {
    expect(validateEmail('')).toBe('Email is required');
    expect(validateEmail('  ')).toBe('Email is required');
  });

  it('returns error for invalid email', () => {
    expect(validateEmail('invalid')).toBe('Please enter a valid email address');
    expect(validateEmail('test@')).toBe('Please enter a valid email address');
    expect(validateEmail('@test.com')).toBe('Please enter a valid email address');
  });

  it('returns null for valid email', () => {
    expect(validateEmail('test@example.com')).toBeNull();
    expect(validateEmail('user@domain.org')).toBeNull();
  });
});

describe('validatePassword', () => {
  it('returns error for empty password', () => {
    expect(validatePassword('')).toBe('Password is required');
  });

  it('returns error for short password', () => {
    expect(validatePassword('abc')).toBe('Password must be at least 6 characters');
    expect(validatePassword('12345')).toBe('Password must be at least 6 characters');
  });

  it('returns null for valid password', () => {
    expect(validatePassword('password123')).toBeNull();
    expect(validatePassword('123456')).toBeNull();
  });
});

describe('validateConfirmPassword', () => {
  it('returns error when empty', () => {
    expect(validateConfirmPassword('pass', '')).toBe('Please confirm your password');
  });

  it('returns error when passwords do not match', () => {
    expect(validateConfirmPassword('pass1', 'pass2')).toBe('Passwords do not match');
  });

  it('returns null when passwords match', () => {
    expect(validateConfirmPassword('password', 'password')).toBeNull();
  });
});

describe('validateTravelQuery', () => {
  it('returns error for empty query', () => {
    expect(validateTravelQuery('')).toBe('Please enter a travel query');
    expect(validateTravelQuery('   ')).toBe('Please enter a travel query');
  });

  it('returns error for short query', () => {
    expect(validateTravelQuery('short')).toBe('Query must be at least 10 characters');
  });

  it('returns error for long query', () => {
    const longQuery = 'a'.repeat(1001);
    expect(validateTravelQuery(longQuery)).toBe('Query must be less than 1000 characters');
  });

  it('returns null for valid query', () => {
    expect(validateTravelQuery('Plan a 5-day trip to Bali')).toBeNull();
  });
});

describe('validateLoginForm', () => {
  it('returns errors for empty fields', () => {
    const errors = validateLoginForm('', '');
    expect(errors).toHaveLength(2);
    expect(errors.find((e) => e.field === 'email')).toBeTruthy();
    expect(errors.find((e) => e.field === 'password')).toBeTruthy();
  });

  it('returns empty array for valid form', () => {
    const errors = validateLoginForm('test@example.com', 'password123');
    expect(errors).toHaveLength(0);
  });
});

describe('validateSignupForm', () => {
  it('returns errors for mismatched passwords', () => {
    const errors = validateSignupForm('test@example.com', 'password123', 'different');
    expect(errors.find((e) => e.field === 'confirmPassword')).toBeTruthy();
  });

  it('returns empty array for valid form', () => {
    const errors = validateSignupForm('test@example.com', 'password123', 'password123');
    expect(errors).toHaveLength(0);
  });
});

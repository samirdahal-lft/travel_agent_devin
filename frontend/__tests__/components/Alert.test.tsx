/**
 * Unit tests for the Alert component.
 */

import { render, screen } from '@testing-library/react';
import Alert from '@/components/ui/Alert';

describe('Alert', () => {
  it('renders children content', () => {
    render(<Alert>Test message</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Test message');
  });

  it('applies error variant styles', () => {
    render(<Alert variant="error">Error occurred</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50');
  });

  it('applies success variant styles', () => {
    render(<Alert variant="success">Success!</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-green-50');
  });

  it('defaults to info variant', () => {
    render(<Alert>Info message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-50');
  });
});

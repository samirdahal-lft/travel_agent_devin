/**
 * Unit tests for the LoadingSpinner component.
 */

import { render, screen } from '@testing-library/react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders the spinner', () => {
    render(<LoadingSpinner />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('shows message when provided', () => {
    render(<LoadingSpinner message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('does not show message when not provided', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('p')).toBeNull();
  });
});

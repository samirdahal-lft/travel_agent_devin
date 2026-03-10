/**
 * Travel query form for submitting travel plan requests.
 */

'use client';

import { FormEvent, useState } from 'react';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { validateTravelQuery } from '@/utils/validation';
import { MapPin, Sparkles } from 'lucide-react';

interface TravelQueryFormProps {
  onSubmit: (query: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const EXAMPLE_QUERIES = [
  'Plan a 5-day trip to Bali with a $2000 budget',
  'Weekend getaway to Paris for two people',
  'Family vacation to Tokyo for 7 days with kids',
  'Solo backpacking trip through Southeast Asia for 2 weeks',
];

export default function TravelQueryForm({
  onSubmit,
  isLoading,
  error,
}: TravelQueryFormProps) {
  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validateTravelQuery(query);
    setValidationError(err);
    if (err) return;
    await onSubmit(query.trim());
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setValidationError(null);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div>
          <label
            htmlFor="travel-query"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <MapPin className="h-4 w-4 text-blue-600" />
            Where do you want to go?
          </label>
          <textarea
            id="travel-query"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setValidationError(null);
            }}
            placeholder="Describe your dream trip... e.g., Plan a 5-day trip to Bali with a $2000 budget"
            rows={4}
            className={`
              w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400
              transition-colors duration-200 resize-none
              focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
              ${validationError ? 'border-red-500' : 'border-gray-300'}
            `}
            disabled={isLoading}
          />
          {validationError && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {validationError}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            {query.length}/1000 characters
          </p>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} size="lg">
          <Sparkles className="mr-2 h-5 w-5" />
          {isLoading ? 'Generating your travel plan...' : 'Generate Travel Plan'}
        </Button>
      </form>

      {/* Example Queries */}
      {!isLoading && (
        <div>
          <p className="mb-3 text-sm font-medium text-gray-500">
            Try an example:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((example) => (
              <button
                key={example}
                onClick={() => handleExampleClick(example)}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

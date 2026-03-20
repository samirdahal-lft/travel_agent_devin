/**
 * Component to display web sources with collapsible preview bars.
 * Each source shows as a clickable bar that expands to show an iframe preview.
 */

'use client';

import { useState } from 'react';
import { Source } from '@/types';
import Card from '@/components/ui/Card';
import { ChevronDown, ChevronUp, ExternalLink, Globe } from 'lucide-react';

interface SourcesSectionProps {
  sources: Source[];
}

export default function SourcesSection({ sources }: SourcesSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!sources || sources.length === 0) {
    return null;
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <Globe className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Sources ({sources.length})
        </h3>
      </div>

      <div className="space-y-2">
        {sources.map((source, index) => (
          <div
            key={`${source.url}-${index}`}
            className="overflow-hidden rounded-lg border border-gray-200"
          >
            {/* Collapsible header bar */}
            <button
              onClick={() => toggleExpand(index)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Globe className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span className="truncate text-sm font-medium text-gray-800">
                  {source.title || source.url}
                </span>
              </div>
              <div className="ml-2 flex flex-shrink-0 items-center gap-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                {expandedIndex === index ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </button>

            {/* Source URL */}
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-1.5">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                {source.url}
              </a>
            </div>

            {/* Collapsible iframe preview */}
            {expandedIndex === index && (
              <div className="border-t border-gray-200">
                <iframe
                  src={source.url}
                  title={source.title || 'Source preview'}
                  className="h-[400px] w-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

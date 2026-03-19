/**
 * Component for displaying the list of past travel conversations.
 */

'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Card, { CardHeader, CardTitle } from '@/components/ui/Card';
import SourcesSection from '@/components/travel/SourcesSection';
import { ConversationHistory } from '@/types';
import { formatDate, truncate } from '@/utils/format';
import { Calendar, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

interface HistoryListProps {
  conversations: ConversationHistory[];
}

export default function HistoryList({ conversations }: HistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (conversations.length === 0) {
    return (
      <Card className="text-center">
        <div className="py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No travel plans yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Start by creating your first travel plan on the dashboard.
          </p>
        </div>
      </Card>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <Card key={conversation.id} className="transition-shadow hover:shadow-md">
          <button
            onClick={() => toggleExpand(conversation.id)}
            className="w-full text-left"
          >
            <CardHeader className="mb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="line-clamp-2">
                    {truncate(conversation.query, 120)}
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(conversation.created_at)}
                  </div>
                </div>
                <div className="flex-shrink-0 pt-1">
                  {expandedId === conversation.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>
          </button>

          {expandedId === conversation.id && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="prose prose-sm prose-blue max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700">
                <ReactMarkdown>{conversation.response}</ReactMarkdown>
              </div>
              {conversation.sources && conversation.sources.length > 0 && (
                <div className="mt-4">
                  <SourcesSection sources={conversation.sources} />
                </div>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

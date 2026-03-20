/**
 * Travel Plan Results page - displays a specific travel plan from history.
 * Accessed via /dashboard/results?id=<conversation_id>
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getTravelHistory } from '@/services/travel';
import { ConversationHistory } from '@/types';
import ReactMarkdown from 'react-markdown';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import SourcesSection from '@/components/travel/SourcesSection';
import Link from 'next/link';
import { formatDate } from '@/utils/format';
import { ArrowLeft, Calendar, MessageSquare } from 'lucide-react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('id');
  const { accessToken, loading: authLoading } = useAuth();
  const [conversation, setConversation] = useState<ConversationHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!accessToken || !conversationId) {
        setLoading(false);
        if (!conversationId) setError('No travel plan ID provided.');
        return;
      }

      try {
        const history = await getTravelHistory(accessToken);
        const found = history.conversations.find((c) => c.id === conversationId);
        if (found) {
          setConversation(found);
        } else {
          setError('Travel plan not found.');
        }
      } catch {
        setError('Failed to load travel plan.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchConversation();
    }
  }, [accessToken, conversationId, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingSpinner size="lg" message="Loading travel plan..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Alert variant="error">{error}</Alert>
        <Link href="/history" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to History
          </Button>
        </Link>
      </div>
    );
  }

  if (!conversation) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/history" className="mb-6 inline-block">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to History
        </Button>
      </Link>

      {/* Query Info */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <MessageSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">Your Query</p>
            <p className="mt-1 text-sm text-blue-800">{conversation.query}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(conversation.created_at)}
        </div>
      </Card>

      {/* Travel Plan Content */}
      <Card>
        <div className="prose prose-blue max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
          <ReactMarkdown>{conversation.response}</ReactMarkdown>
        </div>
      </Card>

      {/* Sources */}
      {conversation.sources && conversation.sources.length > 0 && (
        <div className="mt-6">
          <SourcesSection sources={conversation.sources} />
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <LoadingSpinner size="lg" message="Loading..." />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}

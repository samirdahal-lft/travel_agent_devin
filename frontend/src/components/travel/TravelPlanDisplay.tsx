/**
 * Component to display a generated travel plan with markdown rendering.
 */

'use client';

import ReactMarkdown from 'react-markdown';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TravelPlanResponse } from '@/types';
import { formatDate } from '@/utils/format';
import { ArrowLeft, Calendar, MessageSquare } from 'lucide-react';

interface TravelPlanDisplayProps {
  plan: TravelPlanResponse;
  onNewPlan: () => void;
}

export default function TravelPlanDisplay({
  plan,
  onNewPlan,
}: TravelPlanDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onNewPlan} size="sm">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Plan Another Trip
        </Button>
      </div>

      {/* Query Info */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <MessageSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">Your Query</p>
            <p className="mt-1 text-sm text-blue-800">{plan.query}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(plan.created_at)}
        </div>
      </Card>

      {/* Travel Plan Content */}
      <Card>
        <div className="prose prose-blue max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
          <ReactMarkdown>{plan.plan}</ReactMarkdown>
        </div>
      </Card>
    </div>
  );
}

import type { FeedbackListItem } from '../types/models';
import type { ApiFeedbackStatus } from './feedbackUi';
import { feedbackStatusToUi } from './feedbackUi';
import { formatTimeAgo } from './formatTime';

type ApiListRow = {
  id: string;
  moduleCode: string;
  moduleName: string;
  moduleColour: string;
  comment: string | null;
  status: ApiFeedbackStatus;
  createdAt: string;
  weDidPreview: string | null;
};

export function feedbackRowToListItem(row: ApiListRow): FeedbackListItem {
  const { label, tone } = feedbackStatusToUi(row.status);
  const snippet = row.comment?.trim() || 'No comment provided.';
  const response = row.weDidPreview ? `We did: ${row.weDidPreview}` : undefined;
  return {
    id: row.id,
    dotColor: row.moduleColour,
    title: `${row.moduleCode} – ${row.moduleName}`,
    excerpt: snippet,
    status: label,
    statusTone: tone,
    timeAgo: formatTimeAgo(row.createdAt),
    responseSnippet: response,
  };
}

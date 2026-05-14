import { colors } from '../theme';

export type ApiFeedbackStatus = 'submitted' | 'received' | 'acted_on';

export function feedbackListRowStatusUi(row: {
  status: ApiFeedbackStatus;
  teacherResponse?: string | null;
}): { label: string; tone: 'green' | 'orange' | 'blue' } {
  if (row.status === 'acted_on') {
    return { label: 'Resolved', tone: 'blue' };
  }
  if (row.teacherResponse?.trim()) {
    return { label: 'Responded', tone: 'green' };
  }
  return feedbackStatusToUi(row.status);
}

export function feedbackStatusToUi(status: ApiFeedbackStatus): {
  label: string;
  tone: 'green' | 'orange' | 'blue';
} {
  switch (status) {
    case 'received':
      return { label: 'Received', tone: 'green' };
    case 'acted_on':
      return { label: 'Acted on', tone: 'blue' };
    case 'submitted':
    default:
      return { label: 'Under review', tone: 'orange' };
  }
}

export function studentFeedbackDetailTrackerStep(detail: {
  status: ApiFeedbackStatus;
  teacherResponse: string | null | undefined;
}): number {
  if (detail.status === 'acted_on') {
    return 4;
  }
  if (detail.teacherResponse?.trim()) {
    return 3;
  }
  if (detail.status === 'received') {
    return 2;
  }
  return 1;
}

export function badgeStylesForListRow(row: {
  status: ApiFeedbackStatus;
  teacherResponse?: string | null;
}) {
  const ui = feedbackListRowStatusUi(row);
  const map = {
    green: { statusBg: colors.successMuted, statusColor: '#047857' },
    orange: { statusBg: colors.warningMuted, statusColor: '#C2410C' },
    blue: { statusBg: colors.infoMuted, statusColor: '#1D4ED8' },
  } as const;
  return { label: ui.label, ...map[ui.tone] };
}

export function badgeStylesForStatus(status: ApiFeedbackStatus) {
  return badgeStylesForListRow({ status, teacherResponse: null });
}

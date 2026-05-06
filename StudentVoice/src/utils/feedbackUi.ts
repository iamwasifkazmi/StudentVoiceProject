import { colors } from '../theme';

export type ApiFeedbackStatus = 'submitted' | 'received' | 'acted_on';

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

export function badgeStylesForStatus(status: ApiFeedbackStatus) {
  const ui = feedbackStatusToUi(status);
  const map = {
    green: { statusBg: colors.successMuted, statusColor: '#047857' },
    orange: { statusBg: colors.warningMuted, statusColor: '#C2410C' },
    blue: { statusBg: colors.infoMuted, statusColor: '#1D4ED8' },
  } as const;
  return { label: ui.label, ...map[ui.tone] };
}

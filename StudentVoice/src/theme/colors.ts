/**
 * Single source of truth for Student Voice UI colors (Figma + product spec).
 * Adjust values here to restyle the static UI globally.
 */
export const colors = {
  primaryRed: '#E21D48',
  primaryOrange: '#FF6B35',
  /** Splash / marketing gradient top (screenshot 3 uses a warmer orange) */
  gradientOrangeTop: '#FF6B35',
  /** Optional deeper red at bottom of splash gradient */
  gradientRedBottom: '#E21D48',
  white: '#FFFFFF',
  background: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  cardShadow: 'rgba(15, 23, 42, 0.08)',
  success: '#10B981',
  successMuted: '#D1FAE5',
  warningMuted: '#FFEDD5',
  infoMuted: '#DBEAFE',
  navy: '#1E293B',
  overlayWhite: 'rgba(255, 255, 255, 0.2)',
} as const;

export type ColorName = keyof typeof colors;

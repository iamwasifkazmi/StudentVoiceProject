/**
 * Student Voice UI colors aligned with Figma (Resources/figma-screens).
 */
export const colors = {
  /** Header, tab bar, primary brand */
  primaryRed: '#D32F2F',
  /** Primary CTAs: Log In, Review Submission, progress, active tab accent */
  accentGold: '#C5A059',
  /** Forgot password, footer auth links */
  linkTerracotta: '#BF6B4A',
  /** Sign Up main button (distinct from header red) */
  ctaBurntOrange: '#C85A3C',
  /** See Impact card gradient */
  impactOrange: '#FF9F45',
  impactYellow: '#F5C542',
  /**
   * Warm marketing / gradient accent (See Impact, legacy usages).
   * Prefer `accentGold` for Figma gold CTAs.
   */
  primaryOrange: '#FF9F45',
  /** Splash: gold → red */
  gradientSplashTop: '#CFA64A',
  gradientSplashBottom: '#C62828',
  /** @deprecated Use gradientSplashTop / gradientSplashBottom */
  gradientOrangeTop: '#CFA64A',
  /** @deprecated */
  gradientRedBottom: '#C62828',
  white: '#FFFFFF',
  /** App screen canvas */
  background: '#F5F5F5',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E8E8E8',
  cardShadow: 'rgba(15, 23, 42, 0.08)',
  skeleton: '#E2E8F0',
  success: '#10B981',
  successMuted: '#D1FAE5',
  warningMuted: '#FFEDD5',
  infoMuted: '#DBEAFE',
  navy: '#1E293B',
  overlayWhite: 'rgba(255, 255, 255, 0.2)',
  /** Auth inputs, message panels */
  inputFill: '#F2F2F2',
  /** Status tracker pill tints */
  statusRedMuted: '#FFEBEE',
  statusGoldMuted: '#FFF8E6',
  statusGrayMuted: '#ECEFF1',
  /** Give Feedback home card */
  giveFeedbackPink: '#F48FB1',
} as const;

export type ColorName = keyof typeof colors;

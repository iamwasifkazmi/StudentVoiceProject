import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/** Horizontal padding used across screens (Figma ~16–20px). */
export const horizontalPadding = Math.min(24, Math.max(16, SCREEN_WIDTH * 0.045));

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const tabBarHeight = Platform.select({ ios: 52, default: 56 });
export const fabSize = 56;
/** Vertical lift of the center FAB above the tab row (matches negative margin on the FAB slot). */
export const fabOffset = 32;
/** Top padding inside the red tab bar; keep small so the FAB reads as floating like Figma. */
export const tabBarTopPad = 6;

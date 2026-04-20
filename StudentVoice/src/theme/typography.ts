import { Platform, TextStyle } from 'react-native';

const baseFont = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  hero: {
    fontFamily: baseFont,
    fontSize: 32,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  title: {
    fontFamily: baseFont,
    fontSize: 22,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  subtitle: {
    fontFamily: baseFont,
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  body: {
    fontFamily: baseFont,
    fontSize: 15,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  bodyBold: {
    fontFamily: baseFont,
    fontSize: 15,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  caption: {
    fontFamily: baseFont,
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  small: {
    fontFamily: baseFont,
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  navLabel: {
    fontFamily: baseFont,
    fontSize: 11,
    fontWeight: '500' as TextStyle['fontWeight'],
  },
} as const;

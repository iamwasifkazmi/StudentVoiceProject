import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, horizontalPadding, typography } from '../../theme';

type Props = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  /** Red bar (main app) vs transparent / minimal */
  variant?: 'red' | 'minimal';
};

export function AppHeader({
  title,
  subtitle,
  onBackPress,
  variant = 'red',
}: Props) {
  const insets = useSafeAreaInsets();

  if (variant === 'minimal') {
    return (
      <View style={[styles.minimalWrap, { paddingTop: insets.top + 8 }]}>
        {onBackPress ? (
          <Pressable
            onPress={onBackPress}
            hitSlop={12}
            style={styles.backRow}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
            <Text style={[typography.title, { color: colors.textPrimary }]}>
              {title}
            </Text>
          </Pressable>
        ) : (
          <Text
            style={[
              typography.title,
              { color: colors.textPrimary, paddingHorizontal: horizontalPadding },
            ]}>
            {title}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.redBar, { paddingTop: insets.top }]}>
      <View style={styles.redInner}>
        {onBackPress ? (
          <Pressable
            onPress={onBackPress}
            hitSlop={12}
            style={styles.backRow}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={24} color={colors.white} />
            <Text style={[styles.redTitle, typography.subtitle]}>{title}</Text>
          </Pressable>
        ) : (
          <Text style={[styles.redTitleLarge, typography.subtitle]}>{title}</Text>
        )}
        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  redBar: {
    backgroundColor: colors.primaryRed,
  },
  redInner: {
    paddingHorizontal: horizontalPadding,
    paddingBottom: 14,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  redTitle: {
    color: colors.white,
    fontSize: 18,
  },
  redTitleLarge: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    marginLeft: 28,
  },
  minimalWrap: {
    backgroundColor: colors.background,
    paddingBottom: 8,
  },
});

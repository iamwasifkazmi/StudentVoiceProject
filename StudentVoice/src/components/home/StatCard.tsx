import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { figmaIcons } from '../../assets/figmaIcons';
import { colors, radii, spacing, typography } from '../../theme';

export type StatCardKind = 'submitted' | 'actedOn' | 'modules';

const STAT_SOURCES: Record<StatCardKind, ImageSourcePropType> = {
  submitted: figmaIcons.statSubmitted,
  actedOn: figmaIcons.statActedOn,
  modules: figmaIcons.statActedOn,
};

type Props = {
  kind: StatCardKind;
  value: string;
  label: string;
};

export function StatCard({ kind, value, label }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconTile}>
        <Image
          source={STAT_SOURCES[kind]}
          style={styles.iconImg}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    alignItems: 'stretch',
    gap: 4,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  iconImg: {
    width: 22,
    height: 22,
  },
  value: {
    ...typography.bodyBold,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'left',
  },
  label: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'left',
  },
});

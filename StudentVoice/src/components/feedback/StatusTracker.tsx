import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, typography } from '../../theme';

const STEPS = ['Submitted', 'Under Review', 'Responded', 'Resolved'] as const;

type PillTone = 'todo' | 'activeRed' | 'doneRed' | 'activeGold' | 'doneGold';

function pillTone(stepIndex: number, currentIndex: number): PillTone {
  const step = stepIndex + 1;
  if (step < currentIndex) {
    if (stepIndex <= 1) {
      return 'doneRed';
    }
    if (stepIndex === 2) {
      return 'doneGold';
    }
    return 'doneGold';
  }
  if (step === currentIndex) {
    if (stepIndex <= 1) {
      return 'activeRed';
    }
    if (stepIndex === 2) {
      return 'activeGold';
    }
    return 'todo';
  }
  return 'todo';
}

const toneStyles: Record<
  PillTone,
  { bg: string; fg: string }
> = {
  todo: { bg: colors.statusGrayMuted, fg: colors.textMuted },
  activeRed: { bg: colors.statusRedMuted, fg: colors.primaryRed },
  doneRed: { bg: colors.statusRedMuted, fg: colors.primaryRed },
  activeGold: { bg: colors.statusGoldMuted, fg: '#8D6B2A' },
  doneGold: { bg: colors.statusGoldMuted, fg: '#8D6B2A' },
};

type Props = {
  currentIndex: number;
};

export function StatusTracker({ currentIndex }: Props) {
  return (
    <View style={styles.outer}>
      <View style={styles.row}>
        {STEPS.map((label, i) => {
          const tone = pillTone(i, currentIndex);
          const { bg, fg } = toneStyles[tone];
          return (
            <View key={label} style={[styles.pill, { backgroundColor: bg }]}>
              <View style={[styles.dot, { backgroundColor: fg }]} />
              <Text
                style={[styles.pillLabel, { color: fg }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.65}>
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: colors.statusGrayMuted,
    borderRadius: radii.lg,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 4,
  },
  pill: {
    flex: 1,
    minWidth: 0,
    borderRadius: radii.md,
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillLabel: {
    ...typography.navLabel,
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    fontWeight: '600',
    width: '100%',
  },
});

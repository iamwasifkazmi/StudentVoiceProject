import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, typography } from '../../theme';

const STEPS = ['Submitted', 'Under Review', 'Responded', 'Resolved'] as const;

type Props = {
  currentIndex: number;
};

export function StatusTracker({ currentIndex }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.track}>
        {STEPS.map((label, i) => {
          const state =
            i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'todo';
          return (
            <React.Fragment key={label}>
              <View style={styles.stepBlock}>
                <View
                  style={[
                    styles.circle,
                    state === 'done' && styles.circleRed,
                    state === 'active' && styles.circleOrange,
                    state === 'todo' && styles.circleMuted,
                  ]}
                />
                <Text
                  style={[
                    styles.stepLabel,
                    state === 'active' && { color: colors.primaryOrange },
                    state === 'done' && { color: colors.primaryRed },
                    state === 'todo' && { color: colors.textMuted },
                  ]}
                  numberOfLines={2}>
                  {label}
                </Text>
              </View>
              {i < STEPS.length - 1 ? (
                <View
                  style={[
                    styles.segment,
                    i < currentIndex ? styles.segmentOn : styles.segmentOff,
                  ]}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  stepBlock: {
    width: 72,
    alignItems: 'center',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  circleRed: {
    backgroundColor: colors.primaryRed,
  },
  circleOrange: {
    backgroundColor: colors.primaryOrange,
  },
  circleMuted: {
    backgroundColor: colors.border,
  },
  stepLabel: {
    ...typography.small,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
  },
  segment: {
    width: 12,
    height: 2,
    marginTop: 7,
  },
  segmentOn: {
    backgroundColor: colors.primaryRed,
  },
  segmentOff: {
    backgroundColor: colors.border,
  },
});

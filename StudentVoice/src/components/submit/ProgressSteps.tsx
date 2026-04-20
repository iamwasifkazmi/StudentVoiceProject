import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, horizontalPadding, radii, typography } from '../../theme';

type Props = {
  current: number;
  total: number;
};

export function ProgressSteps({ current, total }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={[typography.caption, styles.stepLabel]}>Step</Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          {current} of {total}
        </Text>
      </View>
      <View style={styles.bar}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              i < current ? styles.filled : styles.empty,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    paddingHorizontal: horizontalPadding,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepLabel: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bar: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: radii.pill,
  },
  filled: {
    backgroundColor: colors.primaryOrange,
  },
  empty: {
    backgroundColor: '#FDE8E9',
  },
});

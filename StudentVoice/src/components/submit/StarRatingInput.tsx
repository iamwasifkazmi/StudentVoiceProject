import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, typography } from '../../theme';

type Props = {
  value: number;
  onChange: (n: number) => void;
  readOnly?: boolean;
};

export function StarRatingInput({ value, onChange, readOnly }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map(n => (
          <Pressable
            key={n}
            disabled={readOnly}
            onPress={() => onChange(n)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${n} out of 5`}>
            <Ionicons
              name={n <= value ? 'star' : 'star-outline'}
              size={40}
              color={n <= value ? colors.primaryOrange : colors.border}
            />
          </Pressable>
        ))}
      </View>
      <View style={styles.labels}>
        <Text style={styles.edge}>Poor</Text>
        <Text style={styles.edge}>Excellent</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 280,
    marginTop: 8,
  },
  edge: {
    ...typography.small,
    color: colors.textSecondary,
  },
});

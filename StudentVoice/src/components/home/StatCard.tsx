import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radii, typography } from '../../theme';

type Props = {
  icon: string;
  value: string;
  label: string;
};

export function StatCard({ icon, value, label }: Props) {
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={22} color={colors.primaryOrange} />
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
    padding: 12,
    alignItems: 'center',
    gap: 4,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  value: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontSize: 18,
  },
  label: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radii, typography } from '../../theme';

type Props = {
  dotColor: string;
  title: string;
  snippet: string;
  status: string;
  statusBg: string;
  statusColor: string;
  timeAgo: string;
  onPress?: () => void;
};

export function RecentActivityCard({
  dotColor,
  title,
  snippet,
  status,
  statusBg,
  statusColor,
  timeAgo,
  onPress,
}: Props) {
  const Inner = (
    <>
      <View style={styles.top}>
        <View style={styles.titleRow}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusBg }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>
      <Text style={styles.snippet} numberOfLines={2}>
        {snippet}
      </Text>
      <View style={styles.meta}>
        <Ionicons name="time-outline" size={14} color={colors.textMuted} />
        <Text style={styles.time}>{timeAgo}</Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textMuted}
          style={styles.chev}
        />
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}>
        {Inner}
      </Pressable>
    );
  }

  return <View style={styles.card}>{Inner}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardTitle: {
    ...typography.bodyBold,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  badgeText: {
    ...typography.small,
    fontWeight: '600',
  },
  snippet: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    ...typography.small,
    color: colors.textMuted,
    flex: 1,
  },
  chev: {
    marginLeft: 'auto',
  },
});

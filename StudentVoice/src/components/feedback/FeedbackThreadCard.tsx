import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radii, typography } from '../../theme';
import type { FeedbackListItem } from '../../data/mockData';

const toneMap = {
  green: { bg: colors.successMuted, fg: '#047857' },
  orange: { bg: colors.warningMuted, fg: '#C2410C' },
  blue: { bg: colors.infoMuted, fg: '#1D4ED8' },
};

type Props = {
  item: FeedbackListItem;
  onPress: () => void;
};

export function FeedbackThreadCard({ item, onPress }: Props) {
  const t = toneMap[item.statusTone];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.96 }]}>
      <View style={styles.top}>
        <View style={[styles.badge, { backgroundColor: t.bg }]}>
          <Text style={[styles.badgeText, { color: t.fg }]}>{item.status}</Text>
        </View>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.time}>{item.timeAgo}</Text>
        </View>
      </View>
      <View style={styles.titleRow}>
        <View style={[styles.dot, { backgroundColor: item.dotColor }]} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.excerpt} numberOfLines={3}>
        {item.excerpt}
      </Text>
      {item.responseSnippet ? (
        <View style={styles.responseBox}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.responseText} numberOfLines={2}>
            {item.responseSnippet}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
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
    marginBottom: 10,
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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    ...typography.small,
    color: colors.textMuted,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    ...typography.bodyBold,
    flex: 1,
  },
  excerpt: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  responseBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    padding: 10,
  },
  responseText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
});

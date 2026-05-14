import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { figmaIcons } from '../../assets/figmaIcons';
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
        <Image
          source={figmaIcons.clock}
          style={styles.metaIcon}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        <Text style={styles.time}>{timeAgo}</Text>
        <Image
          source={figmaIcons.chevronRightMuted}
          style={styles.chevImg}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
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
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  badgeText: {
    ...typography.navLabel,
    lineHeight: 13,
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
    ...typography.navLabel,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textMuted,
    flex: 1,
  },
  metaIcon: {
    width: 10,
    height: 10,
  },
  chevImg: {
    width: 14,
    height: 14,
    marginLeft: 'auto',
  },
});

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { figmaIcons } from '../../assets/figmaIcons';
import { colors, radii, typography } from '../../theme';
import type { FeedbackListItem } from '../../types/models';

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
          <Image
            source={figmaIcons.clock}
            style={styles.clockIcon}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
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
          <Image
            source={figmaIcons.feedbackSnippetBubble}
            style={styles.snippetGlyph}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  badgeText: {
    ...typography.navLabel,
    lineHeight: 13,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  clockIcon: {
    width: 10,
    height: 10,
  },
  time: {
    ...typography.navLabel,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textMuted,
  },
  snippetGlyph: {
    width: 16,
    height: 16,
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

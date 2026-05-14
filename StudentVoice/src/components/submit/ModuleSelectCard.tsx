import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { figmaIcons } from '../../assets/figmaIcons';
import type { ModuleItem } from '../../types/models';
import { colors, radii, typography } from '../../theme';

type Props = {
  item: ModuleItem;
  onPress: () => void;
};

export function ModuleSelectCard({ item, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}>
      <View style={[styles.avatar, { backgroundColor: item.iconBg }]}>
        <Text style={[styles.avatarLetter, { color: item.iconColor }]}>
          {item.letter}
        </Text>
      </View>
      <View style={styles.textCol}>
        <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>
          {item.code} – {item.name}
        </Text>
        {item.statusLine ? (
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {item.statusLine}
          </Text>
        ) : null}
      </View>
      <Image
        source={figmaIcons.chevronRightMuted}
        style={styles.chevron}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputFill,
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: '700',
  },
  textCol: {
    flex: 1,
  },
  chevron: {
    width: 22,
    height: 22,
  },
});

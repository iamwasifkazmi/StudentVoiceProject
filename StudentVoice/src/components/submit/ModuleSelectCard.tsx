import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { ModuleItem } from '../../data/mockData';
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
      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
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
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radii, typography } from '../../theme';

type Props = {
  title: string;
  subtitle: string;
  colorsGrad: [string, string];
  onPress: () => void;
};

export function ActionGradientCard({
  title,
  subtitle,
  colorsGrad,
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <LinearGradient
        colors={colorsGrad}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}>
        <View style={styles.inner}>
          <View style={styles.copy}>
            <Text style={styles.title} numberOfLines={3}>
              {title}
            </Text>
            <Text style={styles.sub} numberOfLines={3}>
              {subtitle}
            </Text>
          </View>
          <View style={styles.spacer} />
          <View style={styles.footer}>
            <View style={styles.miniBtn}>
              <Ionicons name="chevron-forward" size={18} color={colors.primaryRed} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    minWidth: 0,
    borderRadius: radii.xl,
    minHeight: 128,
  },
  card: {
    flex: 1,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    minHeight: 128,
  },
  copy: {
    flexShrink: 1,
  },
  spacer: {
    flexGrow: 1,
    flexShrink: 0,
    minHeight: 8,
  },
  title: {
    ...typography.subtitle,
    color: colors.white,
    fontSize: 16,
  },
  sub: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  miniBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

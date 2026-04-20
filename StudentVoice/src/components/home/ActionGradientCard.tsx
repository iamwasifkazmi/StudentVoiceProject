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
    <Pressable onPress={onPress} style={styles.shadow}>
      <LinearGradient
        colors={colorsGrad}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
        <View style={styles.footer}>
          <View style={styles.miniBtn}>
            <Ionicons name="chevron-forward" size={18} color={colors.primaryRed} />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    flex: 1,
    borderRadius: radii.xl,
    minHeight: 120,
  },
  card: {
    flex: 1,
    borderRadius: radii.xl,
    padding: 14,
    justifyContent: 'space-between',
    overflow: 'hidden',
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
    marginTop: 12,
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

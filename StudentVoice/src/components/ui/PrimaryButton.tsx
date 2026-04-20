import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, radii, typography } from '../../theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'orange' | 'red' | 'white' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'orange',
  disabled,
  loading,
  style,
}: Props) {
  const bg =
    variant === 'orange'
      ? colors.primaryOrange
      : variant === 'red'
        ? colors.primaryRed
        : variant === 'white'
          ? colors.white
          : 'transparent';
  const color =
    variant === 'white'
      ? colors.primaryRed
      : variant === 'outline'
        ? colors.white
        : colors.white;
  const borderWidth = variant === 'outline' ? 2 : 0;
  const borderColor = variant === 'outline' ? colors.white : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          opacity: pressed ? 0.9 : disabled ? 0.5 : 1,
          borderWidth,
          borderColor,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <Text style={[styles.label, { color }, typography.bodyBold]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
  },
});

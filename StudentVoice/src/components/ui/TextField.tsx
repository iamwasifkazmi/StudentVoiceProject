import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, radii, typography } from '../../theme';

type Props = {
  label: string;
  containerStyle?: object;
} & TextInputProps;

export function TextField({ label, containerStyle, style, ...rest }: Props) {
  return (
    <View style={containerStyle}>
      <Text style={[styles.label, typography.caption, { color: colors.textPrimary }]}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, typography.body, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    color: colors.textPrimary,
  },
});

import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radii, typography } from '../../theme';

type Props = {
  label: string;
  containerStyle?: object;
  /** Show eye icon to show/hide text (use with password fields). */
  passwordToggle?: boolean;
} & TextInputProps;

export function TextField({
  label,
  containerStyle,
  style,
  passwordToggle,
  secureTextEntry,
  ...rest
}: Props) {
  const [hidden, setHidden] = useState(true);

  if (passwordToggle) {
    const obscure = hidden;
    return (
      <View style={containerStyle}>
        <Text
          style={[styles.label, typography.caption, { color: colors.textPrimary }]}>
          {label}
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            placeholderTextColor={colors.textMuted}
            style={[styles.inputInRow, typography.body, style]}
            secureTextEntry={obscure}
            {...rest}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={obscure ? 'Show password' : 'Hide password'}
            hitSlop={12}
            onPress={() => setHidden(h => !h)}
            style={styles.eyeBtn}>
            <Ionicons
              name={obscure ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.textMuted}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={[styles.label, typography.caption, { color: colors.textPrimary }]}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, typography.body, style]}
        secureTextEntry={secureTextEntry}
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
    backgroundColor: colors.inputFill,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    color: colors.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputFill,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingRight: 6,
  },
  inputInRow: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    color: colors.textPrimary,
  },
  eyeBtn: {
    padding: 8,
  },
});

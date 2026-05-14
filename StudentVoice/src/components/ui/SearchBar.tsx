import React from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import { figmaIcons } from '../../assets/figmaIcons';
import { colors, radii, typography } from '../../theme';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
}: Props) {
  return (
    <View style={styles.wrap}>
      <Image
        source={figmaIcons.search}
        style={styles.searchIcon}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, typography.body]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    padding: 0,
    color: colors.textPrimary,
  },
});

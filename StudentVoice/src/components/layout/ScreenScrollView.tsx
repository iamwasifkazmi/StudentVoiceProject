import React from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { colors, horizontalPadding } from '../../theme';

type Props = {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  /** When false, background is transparent (e.g. under gradient). */
  padded?: boolean;
};

export function ScreenScrollView({
  children,
  contentContainerStyle,
  padded = true,
}: Props) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.scroll,
        padded && { paddingHorizontal: horizontalPadding },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingBottom: 32,
  },
});

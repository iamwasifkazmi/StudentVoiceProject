import React from 'react';
import type { RefreshControlProps } from 'react-native';
import { RefreshControl, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { colors, horizontalPadding } from '../../theme';

type Props = {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  /** When false, background is transparent (e.g. under gradient). */
  padded?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
};

export function ScreenScrollView({
  children,
  contentContainerStyle,
  padded = true,
  refreshControl,
}: Props) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}
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

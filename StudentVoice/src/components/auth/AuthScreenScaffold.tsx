import React, { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, horizontalPadding } from '../../theme';

type Props = {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Offset for iOS `KeyboardAvoidingView`: safe area + red header row under the status bar.
 * Keep modest — too large adds empty space between fields and the keyboard.
 */
const IOS_HEADER_BODY = 44;

export function AuthScreenScaffold({ header, children, footer }: Props) {
  const insets = useSafeAreaInsets();
  const keyboardOffset =
    Platform.OS === 'ios' ? insets.top + IOS_HEADER_BODY : 0;

  return (
    <View style={styles.root}>
      {header}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 8) + 16 },
          ]}
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.centerBlock,
              { paddingHorizontal: horizontalPadding },
            ]}>
            {children}
          </View>
          {footer ? (
            <View
              style={[
                styles.footer,
                { paddingHorizontal: horizontalPadding },
              ]}>
              {footer}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  /** Top-aligned form: avoid vertical center + flexGrow (causes a huge gap above keyboard). */
  centerBlock: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingTop: 8,
    paddingBottom: 4,
  },
});

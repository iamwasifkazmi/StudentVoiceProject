import React, { useEffect, useState, type ReactNode } from 'react';
import {
  Dimensions,
  Keyboard,
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

/** Red `AppHeader` inner row + padding below status bar (excludes status bar inset). */
const HEADER_CONTENT_BELOW_INSET = 58;

export function AuthScreenScaffold({ header, children, footer }: Props) {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const keyboardOpen = keyboardHeight > 0;
  const screenH = Dimensions.get('window').height;
  const mainMinHeight = keyboardOpen
    ? undefined
    : Math.max(
        0,
        screenH -
          insets.top -
          HEADER_CONTENT_BELOW_INSET -
          Math.max(insets.bottom, 8) -
          (footer ? 48 : 0),
      );

  return (
    <View style={styles.root}>
      {header}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Math.max(insets.bottom, 8) +
              (keyboardOpen ? keyboardHeight + 32 : 28),
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.main,
            keyboardOpen ? styles.mainKeyboardOpen : null,
            { minHeight: mainMinHeight },
          ]}>
          <View
            style={[
              styles.centerBlock,
              { paddingHorizontal: horizontalPadding },
            ]}>
            {children}
          </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  main: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainKeyboardOpen: {
    justifyContent: 'flex-start',
  },
  centerBlock: {
    paddingTop: 8,
    paddingBottom: 8,
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingTop: 8,
    paddingBottom: 4,
  },
});

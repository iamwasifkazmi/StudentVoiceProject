import React, { useCallback } from 'react';
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { figmaIcons } from '../../assets/figmaIcons';
import { useSubmitFeedback } from '../../context/SubmitFeedbackContext';
import { colors, horizontalPadding, radii, typography } from '../../theme';
import type { MainTabParamList, SubmitStackParamList } from '../../navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SubmitStackParamList, 'Confirmation'>,
  BottomTabScreenProps<MainTabParamList>
>;

export function ConfirmationScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { reset } = useSubmitFeedback();

  /** Reset submit flow to module picker, then switch tab. */
  const leaveSuccess = useCallback(
    (target: 'home' | 'feedback') => {
      reset();
      navigation.navigate('Submit', { screen: 'SelectModule' });
      if (target === 'home') {
        navigation.navigate('Home', { screen: 'HomeMain' });
      } else {
        navigation.navigate('MyFeedback', { screen: 'MyFeedbackMain' });
      }
    },
    [navigation, reset],
  );

  return (
    <LinearGradient
      colors={[colors.impactOrange, colors.primaryRed]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View
        style={[
          styles.inner,
          {
            paddingTop: insets.top + 12,
            paddingBottom: Math.max(insets.bottom, 20) + 8,
            paddingHorizontal: horizontalPadding,
          },
        ]}>
        <View style={styles.column}>
          <View style={styles.iconWrap}>
            <Image
              source={figmaIcons.feedbackSuccessCheck}
              style={styles.successMark}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </View>
          <Text style={styles.title}>Thank You!</Text>
          <Text style={styles.msg}>
            Your feedback has been submitted.{'\n'}
            We&apos;ll notify you when staff responds.
          </Text>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View my feedback"
              onPress={() => leaveSuccess('feedback')}
              style={({ pressed }) => [
                styles.btnOutline,
                pressed && { opacity: 0.9 },
              ]}>
              <Text style={styles.btnOutlineLabel}>View my feedback</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to Home"
              onPress={() => leaveSuccess('home')}
              style={({ pressed }) => [
                styles.btnGold,
                pressed && { opacity: 0.92 },
              ]}>
              <Text style={styles.btnGoldLabel}>Back to Home</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconWrap: {
    marginBottom: 20,
  },
  successMark: {
    width: 80,
    height: 80,
  },
  title: {
    ...typography.title,
    fontSize: 26,
    color: colors.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  msg: {
    ...typography.body,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 340,
  },
  actions: {
    marginTop: 22,
    gap: 12,
    width: '100%',
  },
  btnOutline: {
    width: '100%',
    minHeight: 52,
    borderRadius: radii.buttonFull,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  btnOutlineLabel: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 16,
  },
  btnGold: {
    width: '100%',
    minHeight: 52,
    borderRadius: radii.buttonFull,
    backgroundColor: colors.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  btnGoldLabel: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 16,
  },
});

import React from 'react';
import { CommonActions } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppHeader } from '../../components/navigation/AppHeader';
import { useSubmitFeedback } from '../../context/SubmitFeedbackContext';
import { colors, horizontalPadding, typography } from '../../theme';
import type { MainTabParamList, SubmitStackParamList } from '../../navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SubmitStackParamList, 'Confirmation'>,
  BottomTabScreenProps<MainTabParamList>
>;

export function ConfirmationScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { reset } = useSubmitFeedback();

  const done = () => {
    reset();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'SelectModule' }],
      }),
    );
    navigation.getParent()?.getParent()?.navigate('Home');
  };

  return (
    <View style={styles.flex}>
      <AppHeader title="Submit Feedback" />
      <View style={[styles.body, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.iconWrap}>
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              <Ionicons name="checkmark" size={48} color={colors.white} />
            </View>
          </View>
        </View>
        <Text style={styles.title}>Thank You!</Text>
        <Text style={styles.msg}>
          Your feedback has been submitted.{'\n'}
          We&apos;ll notify you when staff responds.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          onPress={done}
          style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>
      <View style={[styles.footer, { height: Math.max(insets.bottom, 12) + 8 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    paddingHorizontal: horizontalPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    marginBottom: 24,
  },
  ringOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  ringInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  msg: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  backBtn: {
    marginTop: 28,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  footer: {
    backgroundColor: colors.primaryRed,
    width: '100%',
  },
});

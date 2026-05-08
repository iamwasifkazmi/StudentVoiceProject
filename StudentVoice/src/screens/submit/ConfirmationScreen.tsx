import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CommonActions,
  useRoute,
  type CompositeScreenProps,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppHeader } from '../../components/navigation/AppHeader';
import { useSubmitFeedback } from '../../context/SubmitFeedbackContext';
import { api } from '../../services/api';
import { colors, horizontalPadding, typography } from '../../theme';
import type { MainTabParamList, SubmitStackParamList } from '../../navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SubmitStackParamList, 'Confirmation'>,
  BottomTabScreenProps<MainTabParamList>
>;

const UNDO_SECONDS = 15;

export function ConfirmationScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { reset } = useSubmitFeedback();
  const route = useRoute<RouteProp<SubmitStackParamList, 'Confirmation'>>();
  const feedbackId = route.params.feedbackId;
  const [secondsLeft, setSecondsLeft] = useState(UNDO_SECONDS);
  const [undoing, setUndoing] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(s => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const finish = useCallback(() => {
    reset();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'SelectModule' }],
      }),
    );
  }, [navigation, reset]);

  const undo = async () => {
    if (secondsLeft <= 0) {
      return;
    }
    try {
      setUndoing(true);
      await api.deleteFeedback(feedbackId);
      Alert.alert('Undone', 'Your feedback was withdrawn.', [
        { text: 'OK', onPress: () => finish() },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not undo';
      Alert.alert('Undo', msg, [{ text: 'OK', onPress: () => finish() }]);
    } finally {
      setUndoing(false);
    }
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
        {secondsLeft > 0 ? (
          <View style={styles.undoBar}>
            <Text style={styles.undoText}>
              Undo available · {secondsLeft}s
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Undo submission"
              disabled={undoing}
              onPress={() => void undo()}
              style={({ pressed }) => [
                styles.undoPress,
                pressed && { opacity: 0.9 },
                undoing && { opacity: 0.5 },
              ]}>
              <Text style={styles.undoPressText}>{undoing ? '…' : 'Undo'}</Text>
            </Pressable>
          </View>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to module selection"
          onPress={finish}
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
  undoBar: {
    marginTop: 20,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: 10,
  },
  undoText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  undoPress: {
    borderWidth: 2,
    borderColor: colors.primaryRed,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 160,
    alignItems: 'center',
  },
  undoPressText: {
    ...typography.bodyBold,
    color: colors.primaryRed,
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

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppHeader } from '../../components/navigation/AppHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { ProgressSteps } from '../../components/submit/ProgressSteps';
import { StarRatingInput } from '../../components/submit/StarRatingInput';
import { useSubmitFeedback } from '../../context/SubmitFeedbackContext';
import { colors, horizontalPadding, radii, typography } from '../../theme';
import type { MainTabParamList, SubmitStackParamList } from '../../navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SubmitStackParamList, 'RateComment'>,
  BottomTabScreenProps<MainTabParamList>
>;

const TAB_BAR_SPACE = 100;
const MAX_CHARS = 500;

export function RateCommentScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { draft, setRating, setComment } = useSubmitFeedback();
  const [comment, setCommentLocal] = useState(draft.comment);

  const moduleLabel = draft.module
    ? `${draft.module.code} — ${draft.module.name}`
    : 'Select a module';

  const goReview = () => {
    setComment(comment);
    if (!draft.rating) {
      return;
    }
    navigation.navigate('ReviewSubmit');
  };

  const skipComment = () => {
    setComment('');
    setCommentLocal('');
    if (draft.rating) {
      navigation.navigate('ReviewSubmit');
    }
  };

  return (
    <View style={styles.flex}>
      <AppHeader title="Submit Feedback" />
      <ProgressSteps current={2} total={3} />
      <ScreenScrollView
        padded={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 20,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        <Text style={styles.section}>Rate your experience</Text>
        <Text style={styles.hint}>{moduleLabel}</Text>
        <StarRatingInput value={draft.rating} onChange={setRating} />
        <Text style={[styles.section, styles.mt]}>Tell us more</Text>
        <Text style={styles.hint2}>What went well? What could be improved?</Text>
        <TextInput
          multiline
          textAlignVertical="top"
          placeholder="Share your thoughts here..."
          placeholderTextColor={colors.textMuted}
          style={styles.area}
          value={comment}
          maxLength={MAX_CHARS}
          onChangeText={t => {
            setCommentLocal(t);
            setComment(t);
          }}
        />
        <Text style={styles.counter}>
          {comment.length} / {MAX_CHARS}
        </Text>
        <PrimaryButton
          label="Review Submission"
          onPress={goReview}
          disabled={!draft.rating}
          style={styles.btn}
        />
        <PrimaryButton
          label="Skip Comment"
          variant="red"
          onPress={skipComment}
          disabled={!draft.rating}
          style={styles.btn2}
        />
      </ScreenScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  hint2: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 8,
  },
  mt: {
    marginTop: 24,
  },
  area: {
    minHeight: 140,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    ...typography.body,
    color: colors.textPrimary,
  },
  counter: {
    ...typography.small,
    color: colors.textMuted,
    alignSelf: 'flex-end',
    marginTop: 6,
    marginBottom: 16,
  },
  btn: {
    width: '100%',
  },
  btn2: {
    width: '100%',
    marginTop: 12,
  },
});

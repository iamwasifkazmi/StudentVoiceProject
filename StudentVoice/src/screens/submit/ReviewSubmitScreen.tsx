import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppHeader } from '../../components/navigation/AppHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { ProgressSteps } from '../../components/submit/ProgressSteps';
import { useSubmitFeedback } from '../../context/SubmitFeedbackContext';
import { colors, horizontalPadding, radii, typography } from '../../theme';
import type { MainTabParamList, SubmitStackParamList } from '../../navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SubmitStackParamList, 'ReviewSubmit'>,
  BottomTabScreenProps<MainTabParamList>
>;

const TAB_BAR_SPACE = 100;

export function ReviewSubmitScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { draft } = useSubmitFeedback();

  const title = draft.module
    ? `${draft.module.code} – ${draft.module.name}`
    : '—';
  const letter = draft.module?.letter ?? '?';
  const bg = draft.module?.iconBg ?? colors.background;

  return (
    <View style={styles.flex}>
      <AppHeader title="Submit Feedback" />
      <ProgressSteps current={3} total={3} />
      <ScreenScrollView
        padded={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 20,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        <Text style={styles.section}>Review &amp; Submit</Text>
        <Text style={styles.hint}>Check everything before submitting</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: bg }]}>
              <Text style={styles.avatarLetter}>{letter}</Text>
            </View>
            <Text style={styles.moduleTitle}>{title}</Text>
          </View>
          <Text style={styles.label}>Rating</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map(n => (
              <Ionicons
                key={n}
                name={n <= draft.rating ? 'star' : 'star-outline'}
                size={28}
                color={colors.primaryOrange}
              />
            ))}
          </View>
          <Text style={[styles.label, styles.mt]}>Comment</Text>
          <Text style={styles.comment}>
            {draft.comment?.trim()
              ? draft.comment
              : 'No additional comments.'}
          </Text>
        </View>
        <PrimaryButton
          label="Submit Feedback"
          onPress={() => navigation.navigate('Confirmation')}
          style={styles.btn}
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
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  moduleTitle: {
    ...typography.bodyBold,
    flex: 1,
  },
  label: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  mt: {
    marginTop: 12,
  },
  stars: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  comment: {
    ...typography.body,
    marginTop: 6,
    color: colors.textPrimary,
  },
  btn: {
    width: '100%',
  },
});

import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppHeader } from '../../components/navigation/AppHeader';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { StarRatingInput } from '../../components/submit/StarRatingInput';
import { api } from '../../services/api';
import { enrichFeedbackDetail } from '../../services/courseCatalog';
import { formatTimeAgo } from '../../utils/formatTime';
import { colors, horizontalPadding, radii, typography } from '../../theme';
import type { TeacherFeedbackStackParamList, TeacherTabParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<TeacherFeedbackStackParamList, 'TeacherFeedbackDetail'>,
  BottomTabScreenProps<TeacherTabParamList>
>;

const TAB_BAR_SPACE = 32;

export function TeacherFeedbackDetailScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<TeacherFeedbackStackParamList, 'TeacherFeedbackDetail'>>();
  const { feedbackId } = route.params;
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof api.getTeacherFeedback>> | null>(
    null,
  );
  const [responseText, setResponseText] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const d = await api.getTeacherFeedback(feedbackId);
      const enriched = enrichFeedbackDetail(d);
      setDetail(enriched);
      setResponseText(enriched.teacherResponse ?? '');
    } catch {
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [feedbackId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (loading && !detail) {
    return (
      <View style={styles.flex}>
        <AppHeader title="Feedback" onBackPress={() => navigation.goBack()} />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primaryRed} />
        </View>
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.flex}>
        <AppHeader title="Feedback" onBackPress={() => navigation.goBack()} />
        <Text style={styles.error}>Could not load this item.</Text>
      </View>
    );
  }

  const submit = async () => {
    const t = responseText.trim();
    if (!t) {
      Alert.alert('Response required', 'Please enter a message for the student.');
      return;
    }
    try {
      setSaving(true);
      await api.respondTeacherFeedback(feedbackId, { response: t });
      await load();
      Alert.alert('Sent', 'The student will see this in their feedback details and alerts.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.flex}>
      <AppHeader title="Respond to feedback" onBackPress={() => navigation.goBack()} />
      <ScreenScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 16,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        <Text style={styles.moduleTitle}>
          {detail.moduleCode} – {detail.moduleName}
        </Text>
        <Text style={styles.meta}>
          {formatTimeAgo(detail.createdAt)} · Status: {detail.status.replace('_', ' ')}
        </Text>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.submitterLabel}>
            Submitter:{' '}
            <Text style={styles.submitterName}>
              {detail.submitterAnonymous ? 'Anonymous' : detail.submitterDisplayName}
            </Text>
          </Text>
        </View>
        <View style={styles.stars}>
          <StarRatingInput value={detail.rating} onChange={() => {}} readOnly />
        </View>
        <Text style={styles.section}>Student comment</Text>
        <View style={styles.quote}>
          <Text style={styles.quoteText}>
            {detail.comment?.trim() || 'No written comment for this submission.'}
          </Text>
        </View>

        {detail.teacherResponse ? (
          <View style={styles.prevBox}>
            <Text style={styles.section}>Your previous reply</Text>
            <Text style={styles.prevText}>{detail.teacherResponse}</Text>
            {detail.teacherResponseAt ? (
              <Text style={styles.prevTime}>{formatTimeAgo(detail.teacherResponseAt)}</Text>
            ) : null}
          </View>
        ) : null}

        <Text style={styles.section}>Your response</Text>
        <Text style={styles.hint}>
          This is shown to the student in-app (push notifications are not sent yet).
        </Text>
        <TextInput
          multiline
          textAlignVertical="top"
          placeholder="Write a helpful reply…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={responseText}
          onChangeText={setResponseText}
        />
        <PrimaryButton
          label={detail.teacherResponse ? 'Update response' : 'Send response'}
          loading={saving}
          onPress={() => void submit()}
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
  loader: {
    paddingVertical: 40,
  },
  error: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  moduleTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 6,
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  submitterLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  submitterName: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stars: {
    marginTop: 12,
  },
  section: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginTop: 20,
  },
  hint: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 8,
  },
  quote: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginTop: 8,
  },
  quoteText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  prevBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: colors.infoMuted,
  },
  prevText: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: 6,
  },
  prevTime: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 8,
  },
  input: {
    minHeight: 120,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    ...typography.body,
    color: colors.textPrimary,
    marginTop: 8,
  },
  btn: {
    marginTop: 20,
    width: '100%',
  },
});

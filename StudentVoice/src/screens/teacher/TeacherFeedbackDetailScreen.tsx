import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
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
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { StarRatingInput } from '../../components/submit/StarRatingInput';
import { api } from '../../services/api';
import { enrichFeedbackDetail } from '../../services/courseCatalog';
import { formatTimeAgo } from '../../utils/formatTime';
import { feedbackListRowStatusUi } from '../../utils/feedbackUi';
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
  const [resolving, setResolving] = useState(false);
  const [editingReply, setEditingReply] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates.height);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const d = await api.getTeacherFeedback(feedbackId);
      const enriched = enrichFeedbackDetail(d);
      setDetail(enriched);
      setResponseText(enriched.teacherResponse ?? '');
      setEditingReply(false);
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
    if (detail.status === 'acted_on') {
      return;
    }
    const t = responseText.trim();
    if (!t) {
      Alert.alert('Response required', 'Please enter a message for the student.');
      return;
    }
    try {
      setSaving(true);
      await api.respondTeacherFeedback(feedbackId, { response: t });
      setEditingReply(false);
      await load();
      Alert.alert(
        detail.teacherResponse ? 'Updated' : 'Sent',
        'The student will see this in their feedback details and alerts.',
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const markResolved = async () => {
    if (detail.status === 'acted_on') {
      return;
    }
    try {
      setResolving(true);
      await api.markTeacherFeedbackResolved(feedbackId);
      await load();
      Alert.alert('Updated', 'The student will see this as resolved in their feedback details.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not update';
      Alert.alert('Error', msg);
    } finally {
      setResolving(false);
    }
  };

  const statusLabel = feedbackListRowStatusUi({
    status: detail.status,
    teacherResponse: detail.teacherResponse,
  }).label;

  const isResolved = detail.status === 'acted_on';
  const hasPostedReply = Boolean(detail.teacherResponse?.trim());
  const canReply = !isResolved;
  const showReplyForm = canReply && (!hasPostedReply || editingReply);
  const canEditReply = hasPostedReply && canReply;

  const startEditingReply = () => {
    if (isResolved) {
      return;
    }
    setResponseText(detail.teacherResponse ?? '');
    setEditingReply(true);
  };

  const cancelEditingReply = () => {
    setResponseText(detail.teacherResponse ?? '');
    setEditingReply(false);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.flex}>
      <AppHeader title="Respond to feedback" onBackPress={() => navigation.goBack()} />
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 16,
          paddingBottom:
            TAB_BAR_SPACE +
            insets.bottom +
            (keyboardHeight > 0 ? keyboardHeight + 24 : 0),
          flexGrow: 1,
          backgroundColor: colors.background,
        }}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.moduleTitle}>
          {detail.moduleCode} – {detail.moduleName}
        </Text>
        <Text style={styles.meta}>
          {formatTimeAgo(detail.createdAt)} · Status: {statusLabel}
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

        {isResolved && !hasPostedReply ? (
          <View style={styles.closedBox}>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            <Text style={styles.closedTitle}>Marked as resolved</Text>
            <Text style={styles.closedHint}>
              This was closed without a staff reply. No further replies can be added.
            </Text>
          </View>
        ) : hasPostedReply && !showReplyForm ? (
          <View style={styles.postedBox}>
            <View style={styles.postedHeader}>
              <View style={styles.postedHeaderText}>
                <Text
                  style={[
                    styles.postedTitle,
                    isResolved && styles.postedTitleResolved,
                  ]}>
                  {isResolved ? 'Resolved' : 'Reply posted'}
                </Text>
                {detail.teacherResponseAt ? (
                  <Text style={styles.postedTime}>
                    {formatTimeAgo(detail.teacherResponseAt)}
                  </Text>
                ) : null}
              </View>
              {canEditReply ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Edit reply"
                  onPress={startEditingReply}
                  hitSlop={12}
                  style={styles.editBtn}>
                  <Ionicons name="pencil" size={20} color={colors.primaryRed} />
                </Pressable>
              ) : null}
            </View>
            <Text style={styles.postedBody}>{detail.teacherResponse}</Text>
            <Text style={styles.postedHint}>
              {isResolved
                ? 'This feedback is closed. The reply cannot be edited.'
                : 'Shown to the student in their feedback details.'}
            </Text>
          </View>
        ) : showReplyForm ? (
          <>
            <Text style={styles.section}>
              {editingReply ? 'Edit your reply' : 'Your response'}
            </Text>
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
              onFocus={() => {
                requestAnimationFrame(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                });
              }}
            />
            <PrimaryButton
              label={editingReply ? 'Save changes' : 'Send response'}
              loading={saving}
              onPress={() => void submit()}
              style={styles.btn}
            />
            {editingReply ? (
              <Pressable onPress={cancelEditingReply} style={styles.cancelEdit}>
                <Text style={styles.cancelEditText}>Cancel</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}
        {isResolved ? (
          hasPostedReply ? (
            <Text style={styles.resolvedNote}>
              This item is marked resolved. Students see it as closed in their progress bar.
            </Text>
          ) : null
        ) : (
          <PrimaryButton
            label="Mark as resolved"
            variant="burnt"
            loading={resolving}
            onPress={() => void markResolved()}
            style={styles.btnResolve}
          />
        )}
      </ScrollView>
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
  postedBox: {
    marginTop: 20,
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: colors.infoMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  postedHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  postedHeaderText: {
    flex: 1,
  },
  postedTitle: {
    ...typography.bodyBold,
    color: colors.success,
  },
  postedTitleResolved: {
    color: '#1D4ED8',
  },
  closedBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: radii.lg,
    backgroundColor: colors.statusGrayMuted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 8,
  },
  closedTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  closedHint: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  postedTime: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 4,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  postedBody: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: 12,
  },
  postedHint: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 10,
  },
  cancelEdit: {
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelEditText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
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
  btnResolve: {
    marginTop: 12,
    width: '100%',
  },
  resolvedNote: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 14,
    textAlign: 'center',
  },
});

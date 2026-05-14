import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { figmaIcons } from '../../assets/figmaIcons';
import { AppHeader } from '../../components/navigation/AppHeader';
import { StatusTracker } from '../../components/feedback/StatusTracker';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { StarRatingInput } from '../../components/submit/StarRatingInput';
import { api } from '../../services/api';
import { enrichFeedbackDetail } from '../../services/courseCatalog';
import { formatTimeAgo } from '../../utils/formatTime';
import { colors, horizontalPadding, radii, typography } from '../../theme';
import type { MainTabParamList, MyFeedbackStackParamList } from '../../navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  NativeStackScreenProps<MyFeedbackStackParamList, 'FeedbackDetail'>,
  BottomTabScreenProps<MainTabParamList>
>;

const TAB_BAR_SPACE = 24;

function statusStepIndex(status: 'submitted' | 'received' | 'acted_on'): number {
  switch (status) {
    case 'submitted':
      return 1;
    case 'received':
      return 2;
    case 'acted_on':
      return 3;
    default:
      return 1;
  }
}

export function FeedbackDetailScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<MyFeedbackStackParamList, 'FeedbackDetail'>>();
  const { feedbackId } = route.params;
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof api.getFeedback>> | null>(
    null,
  );

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const d = await api.getFeedback(feedbackId);
      setDetail(enrichFeedbackDetail(d));
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
        <AppHeader
          title="Feedback Details"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primaryRed} />
        </View>
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.flex}>
        <AppHeader
          title="Feedback Details"
          onBackPress={() => navigation.goBack()}
        />
        <Text style={styles.error}>Could not load this feedback.</Text>
      </View>
    );
  }

  const primaryLoop = detail.closingTheLoop[0];
  const youText =
    detail.comment?.trim() ||
    primaryLoop?.youSaid ||
    'No comment was provided for this submission.';
  const weText = primaryLoop?.weDid ?? 'No official response recorded yet.';

  return (
    <View style={styles.flex}>
      <AppHeader
        title="Feedback Details"
        onBackPress={() => navigation.goBack()}
      />
      <ScreenScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
          backgroundColor: colors.white,
          flexGrow: 1,
        }}>
        <StatusTracker currentIndex={statusStepIndex(detail.status)} />
        <Text style={styles.moduleTitle}>
          {detail.moduleCode} – {detail.moduleName}
        </Text>
        <View style={styles.stars}>
          <StarRatingInput value={detail.rating} onChange={() => {}} readOnly />
        </View>
        <View style={styles.block}>
          <View style={styles.rowLabel}>
            <Image
              source={figmaIcons.feedbackYouSaid}
              style={styles.rowGlyph}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
            <Text style={styles.blockTitle}>You said:</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>{youText}</Text>
            <Text style={styles.time}>{formatTimeAgo(detail.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.block}>
          <View style={styles.rowLabel}>
            <Image
              source={figmaIcons.feedbackWeDid}
              style={styles.rowGlyph}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
            <Text style={styles.blockTitle}>We did:</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>{weText}</Text>
            {primaryLoop ? (
              <Text style={styles.time}>
                {detail.studentCountBadge} students ·{' '}
                {formatTimeAgo(primaryLoop.createdAt)}
              </Text>
            ) : (
              <Text style={styles.time}>Closing the loop</Text>
            )}
          </View>
        </View>
        {detail.teacherResponse ? (
          <View style={styles.block}>
            <View style={styles.rowLabel}>
              <Ionicons name="school-outline" size={18} color={colors.primaryRed} />
              <Text style={styles.blockTitle}>Staff reply:</Text>
            </View>
            <View style={[styles.card, styles.staffCard]}>
              <Text style={styles.cardText}>{detail.teacherResponse}</Text>
              {detail.teacherResponseAt ? (
                <Text style={styles.time}>{formatTimeAgo(detail.teacherResponseAt)}</Text>
              ) : null}
            </View>
          </View>
        ) : null}
      </ScreenScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: horizontalPadding,
  },
  moduleTitle: {
    ...typography.subtitle,
    paddingHorizontal: horizontalPadding,
    marginBottom: 8,
  },
  stars: {
    alignItems: 'flex-start',
    paddingHorizontal: horizontalPadding,
    marginBottom: 20,
    opacity: 0.85,
  },
  block: {
    marginBottom: 20,
    paddingHorizontal: horizontalPadding,
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  rowGlyph: {
    width: 16,
    height: 16,
  },
  blockTitle: {
    ...typography.bodyBold,
  },
  card: {
    backgroundColor: colors.inputFill,
    borderRadius: radii.lg,
    padding: 14,
  },
  staffCard: {
    borderWidth: 1,
    borderColor: colors.primaryRed,
  },
  cardText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  time: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 10,
  },
});

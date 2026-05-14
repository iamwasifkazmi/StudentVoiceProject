import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppHeader } from '../../components/navigation/AppHeader';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { api } from '../../services/api';
import { enrichFeedbackListRow } from '../../services/courseCatalog';
import { colors, horizontalPadding, radii, typography } from '../../theme';
import type { TeacherFeedbackStackParamList, TeacherTabParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<TeacherFeedbackStackParamList, 'TeacherInboxMain'>,
  BottomTabScreenProps<TeacherTabParamList>
>;

const TAB_BAR_SPACE = 100;

export function TeacherInboxScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<
    Awaited<ReturnType<typeof api.listTeacherFeedback>>['items']
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async (mode: 'initial' | 'pull' = 'initial') => {
    try {
      if (mode === 'pull') {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setLoadError(null);
      const { items: rows } = await api.listTeacherFeedback({ limit: '50' });
      setItems(rows.map(r => enrichFeedbackListRow(r)));
    } catch (e: unknown) {
      setItems([]);
      let msg = 'Could not load inbox.';
      if (e && typeof e === 'object' && 'response' in e) {
        const ax = e as { response?: { status?: number; data?: { error?: string } } };
        const errBody = ax.response?.data?.error;
        if (typeof errBody === 'string' && errBody.length > 0) {
          msg = errBody;
        } else if (ax.response?.status === 403) {
          msg =
            'Teacher access only. Sign in with a staff account, or ask your admin to set your role to teacher.';
        } else if (ax.response?.status === 401) {
          msg = 'Session expired. Please sign in again.';
        }
      } else if (e instanceof Error) {
        msg = e.message;
      }
      setLoadError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load('initial');
    }, [load]),
  );

  return (
    <View style={styles.flex}>
      <AppHeader title="Submitted feedback" />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primaryRed} />
        </View>
      ) : null}
      <ScreenScrollView
        padded={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void load('pull')}
            tintColor={colors.primaryRed}
            colors={[colors.primaryRed]}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 16,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        {loadError ? (
          <Text style={styles.error}>{loadError}</Text>
        ) : null}
        {items.map(item => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate('TeacherFeedbackDetail', { feedbackId: item.id })
            }>
            <View style={styles.cardTop}>
              <Text style={styles.code}>{item.moduleCode}</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map(n => (
                  <Ionicons
                    key={n}
                    name={n <= item.rating ? 'star' : 'star-outline'}
                    size={16}
                    color={colors.accentGold}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.title}>{item.moduleName}</Text>
            <Text style={styles.submitter}>
              From:{' '}
              <Text style={styles.submitterName}>
                {item.submitterAnonymous ? 'Anonymous' : item.submitterDisplayName}
              </Text>
            </Text>
            {item.comment ? (
              <Text style={styles.excerpt} numberOfLines={2}>
                {item.comment}
              </Text>
            ) : (
              <Text style={styles.excerptMuted}>No written comment</Text>
            )}
            {item.status === 'acted_on' ? (
              <Text style={styles.replied}>Resolved</Text>
            ) : item.teacherResponse ? (
              <Text style={styles.replied}>You replied</Text>
            ) : (
              <Text style={styles.pending}>Tap to respond</Text>
            )}
          </Pressable>
        ))}
        {!loading && !loadError && items.length === 0 ? (
          <Text style={styles.empty}>No feedback submissions yet.</Text>
        ) : null}
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
    paddingVertical: 24,
  },
  error: {
    ...typography.caption,
    color: colors.primaryRed,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  code: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryRed,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  title: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginTop: 6,
  },
  submitter: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 6,
  },
  submitterName: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  excerpt: {
    ...typography.caption,
    color: colors.textPrimary,
    marginTop: 8,
  },
  excerptMuted: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 8,
    fontStyle: 'italic',
  },
  replied: {
    ...typography.small,
    color: colors.success,
    marginTop: 10,
    fontWeight: '600',
  },
  pending: {
    ...typography.small,
    color: colors.accentGold,
    marginTop: 10,
    fontWeight: '600',
  },
  empty: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});

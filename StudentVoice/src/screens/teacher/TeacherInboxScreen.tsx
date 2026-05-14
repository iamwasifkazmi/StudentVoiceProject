import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
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

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { items: rows } = await api.listTeacherFeedback({ limit: '50' });
      setItems(rows.map(r => enrichFeedbackListRow(r)));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
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
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 16,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
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
            {item.teacherResponse ? (
              <Text style={styles.replied}>You replied</Text>
            ) : (
              <Text style={styles.pending}>Tap to respond</Text>
            )}
          </Pressable>
        ))}
        {!loading && items.length === 0 ? (
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

import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppHeader } from '../../components/navigation/AppHeader';
import { FeedbackThreadCard } from '../../components/feedback/FeedbackThreadCard';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { SearchBar } from '../../components/ui/SearchBar';
import { api } from '../../services/api';
import { enrichFeedbackListRow } from '../../services/courseCatalog';
import { feedbackRowToListItem } from '../../utils/feedbackMappers';
import type { FeedbackListItem } from '../../types/models';
import { colors, horizontalPadding } from '../../theme';
import type { MainTabParamList, MyFeedbackStackParamList } from '../../navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  NativeStackScreenProps<MyFeedbackStackParamList, 'MyFeedbackMain'>,
  BottomTabScreenProps<MainTabParamList>
>;

const TAB_BAR_SPACE = 100;

export function MyFeedbackScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState('');
  const [items, setItems] = useState<FeedbackListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { items: rows } = await api.listFeedback({ limit: '50' });
      setItems(rows.map(r => feedbackRowToListItem(enrichFeedbackListRow(r))));
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

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) {
      return items;
    }
    return items.filter(
      f =>
        f.title.toLowerCase().includes(s) || f.excerpt.toLowerCase().includes(s),
    );
  }, [items, q]);

  return (
    <View style={styles.flex}>
      <AppHeader title="My Feedback" />
      <View style={[styles.searchPad, { paddingHorizontal: horizontalPadding }]}>
        <SearchBar value={q} onChangeText={setQ} />
      </View>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primaryRed} />
        </View>
      ) : null}
      <ScreenScrollView
        padded={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 4,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        {filtered.map(item => (
          <FeedbackThreadCard
            key={item.id}
            item={item}
            onPress={() =>
              navigation.navigate('FeedbackDetail', { feedbackId: item.id })
            }
          />
        ))}
      </ScreenScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchPad: {
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  loader: {
    paddingVertical: 16,
  },
});

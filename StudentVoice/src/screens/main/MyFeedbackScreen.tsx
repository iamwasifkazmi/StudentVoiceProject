import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppHeader } from '../../components/navigation/AppHeader';
import { FeedbackThreadCard } from '../../components/feedback/FeedbackThreadCard';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { SearchBar } from '../../components/ui/SearchBar';
import { MOCK_MY_FEEDBACK } from '../../data/mockData';
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

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) {
      return MOCK_MY_FEEDBACK;
    }
    return MOCK_MY_FEEDBACK.filter(
      f => f.title.toLowerCase().includes(s) || f.excerpt.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <View style={styles.flex}>
      <AppHeader title="My Feedback" />
      <View style={[styles.searchPad, { paddingHorizontal: horizontalPadding }]}>
        <SearchBar value={q} onChangeText={setQ} />
      </View>
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
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
});

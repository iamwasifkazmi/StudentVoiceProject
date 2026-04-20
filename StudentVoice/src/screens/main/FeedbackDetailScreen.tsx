import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppHeader } from '../../components/navigation/AppHeader';
import { StatusTracker } from '../../components/feedback/StatusTracker';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { StarRatingInput } from '../../components/submit/StarRatingInput';
import { colors, horizontalPadding, radii, typography } from '../../theme';
import type { MainTabParamList, MyFeedbackStackParamList } from '../../navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  NativeStackScreenProps<MyFeedbackStackParamList, 'FeedbackDetail'>,
  BottomTabScreenProps<MainTabParamList>
>;

const TAB_BAR_SPACE = 24;

export function FeedbackDetailScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

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
        }}>
        <StatusTracker currentIndex={2} />
        <Text style={styles.moduleTitle}>CO7100 – Research Dissertation</Text>
        <View style={styles.stars}>
          <StarRatingInput value={4} onChange={() => {}} readOnly />
        </View>
        <View style={styles.block}>
          <View style={styles.rowLabel}>
            <Ionicons name="chatbubble-ellipses" size={18} color="#1D4ED8" />
            <Text style={styles.blockTitle}>You said:</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Assignment briefs were unclear about word count expectations.
            </Text>
            <Text style={styles.time}>1 day ago</Text>
          </View>
        </View>
        <View style={styles.block}>
          <View style={styles.rowLabel}>
            <Ionicons name="chatbubble-ellipses" size={18} color={colors.success} />
            <Text style={styles.blockTitle}>We did:</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              All briefs now include a standardized requirements checklist.
            </Text>
            <Text style={styles.time}>1 day ago</Text>
          </View>
        </View>
      </ScreenScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
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
  blockTitle: {
    ...typography.bodyBold,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 14,
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

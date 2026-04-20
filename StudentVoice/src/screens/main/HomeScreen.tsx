import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppHeader } from '../../components/navigation/AppHeader';
import { ActionGradientCard } from '../../components/home/ActionGradientCard';
import { RecentActivityCard } from '../../components/home/RecentActivityCard';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { StatCard } from '../../components/home/StatCard';
import { useAuth } from '../../context/AuthContext';
import { colors, horizontalPadding, typography } from '../../theme';
import type { HomeStackParamList } from '../../navigation/types';
import type { MainTabParamList } from '../../navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeMain'>,
  BottomTabScreenProps<MainTabParamList>
>;

const TAB_BAR_SPACE = 100;

export function HomeScreen({ navigation }: Props) {
  const { userName } = useAuth();
  const insets = useSafeAreaInsets();

  const goSubmit = () => {
    navigation.getParent()?.navigate('Submit', {
      screen: 'SelectModule',
    });
  };

  return (
    <View style={styles.flex}>
      <AppHeader
        title="Student Voice"
        subtitle={`Welcome back, ${userName}`}
      />
      <ScreenScrollView
        padded={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: horizontalPadding,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        <View style={styles.stats}>
          <StatCard icon="chatbubble-outline" value="04" label="Submitted" />
          <StatCard icon="checkmark-circle-outline" value="02" label="Acted on" />
          <StatCard icon="book-outline" value="02" label="Modules" />
        </View>
        <View style={styles.actions}>
          <ActionGradientCard
            title="Give Feedback"
            subtitle="Rate a module"
            colorsGrad={[colors.primaryRed, '#C91840']}
            onPress={goSubmit}
          />
          <ActionGradientCard
            title="See Impact"
            subtitle="You said / We did"
            colorsGrad={[colors.primaryOrange, '#E85A2A']}
            onPress={() => navigation.navigate('SeeImpact')}
          />
        </View>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Pressable onPress={() => navigation.getParent()?.navigate('MyFeedback')}>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>
        <RecentActivityCard
          dotColor="#22C55E"
          title="CO7100 – Research Dissertation"
          snippet="Assignment briefs were unclear about word count expectations."
          status="Received"
          statusBg={colors.successMuted}
          statusColor="#047857"
          timeAgo="2 days ago"
        />
        <RecentActivityCard
          dotColor="#3B82F6"
          title="CO6050 – Human-Computer Interaction"
          snippet="Would love more examples in the slides before coursework deadlines."
          status="Updated"
          statusBg={colors.infoMuted}
          statusColor="#1D4ED8"
          timeAgo="2 days ago"
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
  stats: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  seeAll: {
    ...typography.caption,
    color: colors.primaryRed,
    fontWeight: '600',
  },
});

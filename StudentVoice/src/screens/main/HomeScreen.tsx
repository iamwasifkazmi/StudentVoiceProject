import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppHeader } from '../../components/navigation/AppHeader';
import { ActionGradientCard } from '../../components/home/ActionGradientCard';
import { RecentActivityCard } from '../../components/home/RecentActivityCard';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { StatCard } from '../../components/home/StatCard';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { formatTimeAgo } from '../../utils/formatTime';
import { badgeStylesForStatus } from '../../utils/feedbackUi';
import { colors, horizontalPadding, typography } from '../../theme';
import type { HomeStackParamList } from '../../navigation/types';
import type { MainTabParamList } from '../../navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeMain'>,
  BottomTabScreenProps<MainTabParamList>
>;

const TAB_BAR_SPACE = 100;

function statDigits(n: number): string {
  if (n > 99) {
    return '99+';
  }
  return String(n).padStart(2, '0');
}

export function HomeScreen({ navigation }: Props) {
  const { userName } = useAuth();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [dash, setDash] = useState<{
    feedbackCount: number;
    actedOnCount: number;
    moduleCount: number;
    recentActivity: {
      id: string;
      moduleCode: string;
      moduleName: string;
      moduleColour: string;
      status: 'submitted' | 'received' | 'acted_on';
      snippet: string;
      updatedAt: string;
    }[];
  } | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getDashboard();
      setDash(data);
    } catch {
      setDash(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const goSubmit = () => {
    navigation.getParent()?.navigate('Submit', {
      screen: 'SelectModule',
    });
  };

  const openFeedback = (id: string) => {
    navigation.getParent()?.navigate('MyFeedback', {
      screen: 'FeedbackDetail',
      params: { feedbackId: id },
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
        {loading && !dash ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primaryRed} />
          </View>
        ) : null}
        <View style={styles.stats}>
          <StatCard
            icon="chatbubble-outline"
            value={statDigits(dash?.feedbackCount ?? 0)}
            label="Submitted"
          />
          <StatCard
            icon="checkmark-circle-outline"
            value={statDigits(dash?.actedOnCount ?? 0)}
            label="Acted on"
          />
          <StatCard
            icon="book-outline"
            value={statDigits(dash?.moduleCount ?? 0)}
            label="Modules"
          />
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
        {(dash?.recentActivity ?? []).slice(0, 5).map(row => {
          const badge = badgeStylesForStatus(row.status);
          return (
            <RecentActivityCard
              key={row.id}
              dotColor={row.moduleColour}
              title={`${row.moduleCode} – ${row.moduleName}`}
              snippet={row.snippet || '—'}
              status={badge.label}
              statusBg={badge.statusBg}
              statusColor={badge.statusColor}
              timeAgo={formatTimeAgo(row.updatedAt)}
              onPress={() => openFeedback(row.id)}
            />
          );
        })}
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
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
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

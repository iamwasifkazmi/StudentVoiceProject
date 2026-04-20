import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppHeader } from '../../components/navigation/AppHeader';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { MOCK_IMPACT } from '../../data/mockData';
import { colors, horizontalPadding, radii, typography } from '../../theme';
import type { HomeStackParamList, MainTabParamList } from '../../navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'SeeImpact'>,
  BottomTabScreenProps<MainTabParamList>
>;

const TAB_BAR_SPACE = 100;

export function SeeImpactScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.flex}>
      <AppHeader
        title="See Impact"
        onBackPress={() => navigation.goBack()}
      />
      <ScreenScrollView
        padded={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 16,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        <Text style={styles.intro}>
          Closing the loop — see how your feedback drove change across modules.
        </Text>
        {MOCK_IMPACT.map(entry => (
          <View key={entry.id} style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{entry.students} students</Text>
            </View>
            <Text style={styles.label}>You said</Text>
            <Text style={styles.quote}>&ldquo;{entry.youSaid}&rdquo;</Text>
            <Text style={[styles.label, styles.mt]}>We did</Text>
            <Text style={styles.body}>{entry.weDid}</Text>
          </View>
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
  intro: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 14,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warningMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginBottom: 10,
  },
  badgeText: {
    ...typography.small,
    color: '#C2410C',
    fontWeight: '600',
  },
  label: {
    ...typography.caption,
    color: colors.primaryRed,
    fontWeight: '700',
  },
  mt: {
    marginTop: 12,
  },
  quote: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  body: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: 4,
  },
});

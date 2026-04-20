import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppHeader } from '../../components/navigation/AppHeader';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { MOCK_ALERTS } from '../../data/mockData';
import { colors, horizontalPadding, radii, typography } from '../../theme';
import type { MainTabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Alerts'>;

const TAB_BAR_SPACE = 100;

export function AlertsScreen(_props: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.flex}>
      <AppHeader title="Alerts" />
      <ScreenScrollView
        padded={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 16,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        {MOCK_ALERTS.map(alert => (
          <View key={alert.id} style={styles.card}>
            <View style={styles.iconCircle}>
              <Ionicons
                name={alert.icon === 'chat' ? 'chatbubble-outline' : 'refresh-outline'}
                size={22}
                color={colors.textSecondary}
              />
            </View>
            <View style={styles.textCol}>
              <Text style={styles.cardTitle}>{alert.title}</Text>
              <Text style={styles.cardBody}>{alert.body}</Text>
              <Text style={styles.time}>{alert.timeAgo}</Text>
            </View>
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
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: 12,
    gap: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
  },
  cardTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  cardBody: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  time: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 8,
  },
});

import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { figmaIcons } from '../../assets/figmaIcons';
import { AppHeader } from '../../components/navigation/AppHeader';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { api } from '../../services/api';
import { formatTimeAgo } from '../../utils/formatTime';
import type { AlertItem } from '../../types/models';
import type { ImageSourcePropType } from 'react-native';
import { colors, horizontalPadding, radii, typography } from '../../theme';
import type { MainTabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Alerts'>;

const TAB_BAR_SPACE = 100;

function alertIconSource(t: AlertItem['icon'] | string): ImageSourcePropType {
  return t === 'refresh' ? figmaIcons.alertRefresh : figmaIcons.alertChat;
}

export function AlertsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { items: rows } = await api.listNotifications({ limit: '50' });
      setItems(
        rows.map(r => ({
          id: r.id,
          icon: r.type === 'action_taken' ? 'refresh' : 'chat',
          title: r.title,
          body: r.description,
          timeAgo: formatTimeAgo(r.createdAt),
          isRead: r.isRead,
          referenceId: r.referenceId,
        })),
      );
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

  const open = async (item: AlertItem) => {
    try {
      if (!item.isRead) {
        await api.markNotificationRead(item.id);
        setItems(prev =>
          prev.map(x => (x.id === item.id ? { ...x, isRead: true } : x)),
        );
      }
      if (item.referenceId) {
        navigation.navigate('MyFeedback', {
          screen: 'FeedbackDetail',
          params: { feedbackId: item.referenceId },
        });
      } else {
        navigation.navigate('MyFeedback');
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <View style={styles.flex}>
      <AppHeader title="Alerts" />
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
        {items.map(alert => (
          <Pressable
            key={alert.id}
            onPress={() => void open(alert)}
            style={({ pressed }) => [
              styles.card,
              !alert.isRead && styles.unread,
              pressed && { opacity: 0.92 },
            ]}>
            <View style={styles.iconSlot}>
              <Image
                source={alertIconSource(alert.icon)}
                style={styles.alertIcon}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
            </View>
            <View style={styles.textCol}>
              <Text style={[styles.cardTitle, !alert.isRead && styles.bold]}>
                {alert.title}
              </Text>
              <Text style={styles.cardBody}>{alert.body}</Text>
              <Text style={styles.time}>{alert.timeAgo}</Text>
            </View>
          </Pressable>
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
  loader: {
    paddingVertical: 16,
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
  unread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accentGold,
  },
  iconSlot: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIcon: {
    width: 48,
    height: 48,
  },
  textCol: {
    flex: 1,
  },
  cardTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  bold: {
    fontWeight: '800',
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

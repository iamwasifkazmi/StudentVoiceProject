import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  colors,
  fabOffset,
  fabSize,
  horizontalPadding,
  tabBarHeight,
  typography,
} from '../../theme';

const TAB_CONFIG: Record<
  string,
  { icon: string; iconActive: string; label: string }
> = {
  Home: { icon: 'home-outline', iconActive: 'home', label: 'Home' },
  MyFeedback: {
    icon: 'chatbubble-outline',
    iconActive: 'chatbubble-ellipses',
    label: 'My Feedback',
  },
  Submit: { icon: 'add', iconActive: 'add', label: 'Submit' },
  Alerts: {
    icon: 'notifications-outline',
    iconActive: 'notifications',
    label: 'Alerts',
  },
  Settings: {
    icon: 'settings-outline',
    iconActive: 'settings',
    label: 'Settings',
  },
};

export function MainTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          paddingHorizontal: horizontalPadding * 0.5,
        },
      ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          TAB_CONFIG[route.name]?.label ??
          options.title ??
          route.name;
        const isFocused = state.index === index;
        const cfg = TAB_CONFIG[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (route.name === 'Submit') {
          return (
            <View key={route.key} style={styles.fabSlot}>
              <Pressable
                onPress={onPress}
                style={styles.fabOuter}
                accessibilityRole="button"
                accessibilityLabel="Submit feedback">
                <View style={styles.fabInner}>
                  <Ionicons name="add" size={28} color={colors.white} />
                </View>
              </Pressable>
              <Text
                style={[
                  styles.navText,
                  typography.navLabel,
                  isFocused && styles.navTextActive,
                ]}>
                {label}
              </Text>
              {isFocused ? <View style={styles.underline} /> : null}
            </View>
          );
        }

        const iconName =
          isFocused && cfg ? cfg.iconActive : cfg?.icon ?? 'ellipse-outline';

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={label}
            onPress={onPress}
            style={styles.tab}>
            <Ionicons
              name={iconName}
              size={22}
              color={isFocused ? colors.primaryOrange : colors.white}
            />
            <Text
              style={[
                styles.navText,
                typography.navLabel,
                isFocused && styles.navTextActive,
              ]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryRed,
    minHeight: tabBarHeight + fabOffset,
    paddingTop: fabOffset,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
    gap: 2,
  },
  fabSlot: {
    flex: 1,
    alignItems: 'center',
    marginTop: -fabOffset,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  fabOuter: {
    width: fabSize,
    height: fabSize,
    borderRadius: fabSize / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabInner: {
    width: fabSize - 14,
    height: fabSize - 14,
    borderRadius: (fabSize - 14) / 2,
    backgroundColor: colors.primaryOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    color: colors.white,
    marginTop: 2,
    textAlign: 'center',
  },
  navTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  underline: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primaryOrange,
    marginTop: 2,
  },
});

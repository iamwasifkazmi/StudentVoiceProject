import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  colors,
  horizontalPadding,
  tabBarHeight,
  typography,
} from '../../theme';

const TABS: Record<string, { icon: string; iconActive: string; label: string }> = {
  TeacherInbox: {
    icon: 'mail-open-outline',
    iconActive: 'mail-open',
    label: 'Inbox',
  },
  Settings: {
    icon: 'settings-outline',
    iconActive: 'settings',
    label: 'Settings',
  },
};

export function TeacherTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
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
        const label = TABS[route.name]?.label ?? route.name;
        const isFocused = state.index === index;
        const cfg = TABS[route.name];
        const iconName =
          isFocused && cfg ? cfg.iconActive : cfg?.icon ?? 'ellipse-outline';

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
              color={isFocused ? colors.accentGold : colors.white}
            />
            <Text style={[styles.navText, isFocused && styles.navTextActive]}>
              {label}
            </Text>
            {isFocused ? <View style={styles.underline} /> : null}
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
    justifyContent: 'space-around',
    backgroundColor: colors.primaryRed,
    minHeight: tabBarHeight,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 6,
    gap: 2,
  },
  navText: {
    ...typography.navLabel,
    fontSize: 10,
    lineHeight: 12,
    color: colors.white,
    marginTop: 2,
    textAlign: 'center',
  },
  navTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  underline: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accentGold,
    marginTop: 2,
  },
});

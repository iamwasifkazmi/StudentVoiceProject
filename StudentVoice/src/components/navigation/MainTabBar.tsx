import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { figmaIcons } from '../../assets/figmaIcons';
import {
  colors,
  fabOffset,
  fabSize,
  horizontalPadding,
  tabBarHeight,
  tabBarTopPad,
  typography,
} from '../../theme';

const TAB_FIGMA: Record<
  string,
  { idle: ImageSourcePropType; active: ImageSourcePropType; label: string }
> = {
  Home: {
    idle: figmaIcons.tabHome,
    active: figmaIcons.tabHomeActive,
    label: 'Home',
  },
  MyFeedback: {
    idle: figmaIcons.tabFeedback,
    active: figmaIcons.tabFeedbackActive,
    label: 'My Feedback',
  },
  Alerts: {
    idle: figmaIcons.tabAlerts,
    active: figmaIcons.tabAlertsActive,
    label: 'Alerts',
  },
  Settings: {
    idle: figmaIcons.tabSettings,
    active: figmaIcons.tabSettingsActive,
    label: 'Settings',
  },
};

const TAB_ICON_PX = 22;

export function MainTabBar({
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
        const { options } = descriptors[route.key];
        const pair = TAB_FIGMA[route.name];
        const label = pair?.label ?? options.title ?? route.name;
        const isFocused = state.index === index;

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
                style={styles.fabPress}
                accessibilityRole="button"
                accessibilityLabel="Submit feedback">
                <Image
                  source={figmaIcons.tabSubmitFab}
                  style={styles.fabImg}
                  resizeMode="contain"
                  accessibilityIgnoresInvertColors
                />
              </Pressable>
              <Text
                style={[styles.navText, isFocused && styles.navTextActive]}>
                {label}
              </Text>
              {isFocused ? <View style={styles.underline} /> : null}
            </View>
          );
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={label}
            onPress={onPress}
            style={styles.tab}>
            <Image
              source={isFocused && pair ? pair.active : pair?.idle ?? figmaIcons.tabHome}
              style={styles.tabIcon}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
            <Text
              style={[styles.navText, isFocused && styles.navTextActive]}>
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
    paddingTop: tabBarTopPad,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
    gap: 2,
  },
  tabIcon: {
    width: TAB_ICON_PX,
    height: TAB_ICON_PX,
  },
  fabSlot: {
    flex: 1,
    alignItems: 'center',
    marginTop: -fabOffset,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  fabPress: {
    width: fabSize,
    height: fabSize,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabImg: {
    width: fabSize,
    height: fabSize,
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

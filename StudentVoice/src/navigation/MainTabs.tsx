import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabBar } from '../components/navigation/MainTabBar';
import { AlertsScreen } from '../screens/main/AlertsScreen';
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { HomeStackNavigator } from './HomeStack';
import { MyFeedbackStackNavigator } from './MyFeedbackStack';
import { SubmitStackNavigator } from './SubmitStack';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={MainTabBar}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="MyFeedback" component={MyFeedbackStackNavigator} />
      <Tab.Screen name="Submit" component={SubmitStackNavigator} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

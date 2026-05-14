import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TeacherTabBar } from '../components/navigation/TeacherTabBar';
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { TeacherFeedbackStackNavigator } from './TeacherFeedbackStack';
import type { TeacherTabParamList } from './types';

const Tab = createBottomTabNavigator<TeacherTabParamList>();

export function TeacherMainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <TeacherTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen name="TeacherInbox" component={TeacherFeedbackStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

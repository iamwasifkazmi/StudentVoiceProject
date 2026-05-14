import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TeacherFeedbackDetailScreen } from '../screens/teacher/TeacherFeedbackDetailScreen';
import { TeacherInboxScreen } from '../screens/teacher/TeacherInboxScreen';
import type { TeacherFeedbackStackParamList } from './types';

const Stack = createNativeStackNavigator<TeacherFeedbackStackParamList>();

export function TeacherFeedbackStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeacherInboxMain" component={TeacherInboxScreen} />
      <Stack.Screen
        name="TeacherFeedbackDetail"
        component={TeacherFeedbackDetailScreen}
      />
    </Stack.Navigator>
  );
}

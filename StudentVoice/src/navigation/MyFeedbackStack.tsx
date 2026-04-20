import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedbackDetailScreen } from '../screens/main/FeedbackDetailScreen';
import { MyFeedbackScreen } from '../screens/main/MyFeedbackScreen';
import type { MyFeedbackStackParamList } from './types';

const Stack = createNativeStackNavigator<MyFeedbackStackParamList>();

export function MyFeedbackStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyFeedbackMain" component={MyFeedbackScreen} />
      <Stack.Screen name="FeedbackDetail" component={FeedbackDetailScreen} />
    </Stack.Navigator>
  );
}

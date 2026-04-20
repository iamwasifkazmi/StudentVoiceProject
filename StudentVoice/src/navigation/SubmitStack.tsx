import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConfirmationScreen } from '../screens/submit/ConfirmationScreen';
import { RateCommentScreen } from '../screens/submit/RateCommentScreen';
import { ReviewSubmitScreen } from '../screens/submit/ReviewSubmitScreen';
import { SelectModuleScreen } from '../screens/submit/SelectModuleScreen';
import type { SubmitStackParamList } from './types';

const Stack = createNativeStackNavigator<SubmitStackParamList>();

export function SubmitStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SelectModule" component={SelectModuleScreen} />
      <Stack.Screen name="RateComment" component={RateCommentScreen} />
      <Stack.Screen name="ReviewSubmit" component={ReviewSubmitScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
    </Stack.Navigator>
  );
}

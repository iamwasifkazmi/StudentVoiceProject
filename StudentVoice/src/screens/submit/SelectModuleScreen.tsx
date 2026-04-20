import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppHeader } from '../../components/navigation/AppHeader';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { ModuleSelectCard } from '../../components/submit/ModuleSelectCard';
import { ProgressSteps } from '../../components/submit/ProgressSteps';
import { MOCK_MODULES } from '../../data/mockData';
import { useSubmitFeedback } from '../../context/SubmitFeedbackContext';
import { colors, horizontalPadding, typography } from '../../theme';
import type { MainTabParamList, SubmitStackParamList } from '../../navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SubmitStackParamList, 'SelectModule'>,
  BottomTabScreenProps<MainTabParamList>
>;

const TAB_BAR_SPACE = 100;

export function SelectModuleScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { setModule } = useSubmitFeedback();

  return (
    <View style={styles.flex}>
      <AppHeader title="Submit Feedback" />
      <ProgressSteps current={1} total={3} />
      <ScreenScrollView
        padded={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 20,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        <Text style={styles.section}>Select module</Text>
        <Text style={styles.hint}>Choose which module to give feedback on</Text>
        {MOCK_MODULES.map(m => (
          <ModuleSelectCard
            key={m.id}
            item={m}
            onPress={() => {
              setModule(m);
              navigation.navigate('RateComment');
            }}
          />
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
  section: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 16,
  },
});

import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppHeader } from '../../components/navigation/AppHeader';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { ModuleSelectCard } from '../../components/submit/ModuleSelectCard';
import { ProgressSteps } from '../../components/submit/ProgressSteps';
import { SearchBar } from '../../components/ui/SearchBar';
import { useSubmitFeedback } from '../../context/SubmitFeedbackContext';
import { api } from '../../services/api';
import { moduleFromApi } from '../../utils/moduleMap';
import type { ModuleItem } from '../../types/models';
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
  const [q, setQ] = useState('');
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await api.getModules();
      setModules(rows.map(moduleFromApi));
    } catch {
      setModules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) {
      return modules;
    }
    return modules.filter(
      m =>
        m.code.toLowerCase().includes(s) ||
        m.name.toLowerCase().includes(s) ||
        (m.statusLine?.toLowerCase().includes(s) ?? false),
    );
  }, [modules, q]);

  return (
    <View style={styles.flex}>
      <AppHeader title="Submit Feedback" />
      <ProgressSteps current={1} total={3} />
      <View style={[styles.searchPad, { paddingHorizontal: horizontalPadding }]}>
        <SearchBar value={q} onChangeText={setQ} placeholder="Search modules..." />
      </View>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primaryRed} />
        </View>
      ) : null}
      <ScreenScrollView
        padded={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 8,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        <Text style={styles.section}>Select module</Text>
        <Text style={styles.hint}>Choose which module to give feedback on</Text>
        {filtered.map(m => (
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
  searchPad: {
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  loader: {
    paddingVertical: 12,
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

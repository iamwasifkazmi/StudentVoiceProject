import React, { useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppHeader } from '../../components/navigation/AppHeader';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { useAuth } from '../../context/AuthContext';
import { colors, horizontalPadding, radii, typography } from '../../theme';
import type { MainTabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Settings'>;

const TAB_BAR_SPACE = 100;

export function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const [pushOn, setPushOn] = useState(true);
  const [anon, setAnon] = useState(false);

  const logout = () => {
    signOut();
    navigation.getParent()?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      }),
    );
  };

  return (
    <View style={styles.flex}>
      <AppHeader title="Settings" />
      <ScreenScrollView
        padded={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 20,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
        }}>
        <Text style={styles.section}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
            </View>
            <Text style={styles.rowLabel}>Push Notifications</Text>
            <Switch
              value={pushOn}
              onValueChange={setPushOn}
              trackColor={{ false: colors.border, true: colors.primaryOrange }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons name="shield-outline" size={22} color={colors.textPrimary} />
            </View>
            <View style={styles.col}>
              <Text style={styles.rowLabel}>Anonymous Mode</Text>
              <Text style={styles.sub}>Submit feedback without your name</Text>
            </View>
            <Switch
              value={anon}
              onValueChange={setAnon}
              trackColor={{ false: colors.border, true: colors.primaryOrange }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <Text style={[styles.section, styles.mt]}>Preferences</Text>
        <View style={styles.card}>
          <Pressable style={styles.row} onPress={() => {}}>
            <View style={styles.iconBox}>
              <Ionicons name="settings-outline" size={22} color={colors.textPrimary} />
            </View>
            <Text style={[styles.rowLabel, { flex: 1 }]}>App Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        </View>

        <Pressable style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
        <Text style={styles.version}>Student Voice v0.0.1</Text>
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
    marginBottom: 10,
    color: colors.textPrimary,
  },
  mt: {
    marginTop: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingVertical: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    ...typography.bodyBold,
    flex: 1,
  },
  col: {
    flex: 1,
  },
  sub: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 64,
  },
  logout: {
    marginTop: 28,
    alignItems: 'center',
    padding: 14,
  },
  logoutText: {
    ...typography.bodyBold,
    color: colors.primaryRed,
  },
  version: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
});

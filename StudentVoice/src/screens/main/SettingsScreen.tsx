import React, { useCallback, useEffect, useState } from 'react';
import { CommonActions, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import {
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { figmaIcons } from '../../assets/figmaIcons';
import { AppHeader } from '../../components/navigation/AppHeader';
import { ScreenScrollView } from '../../components/layout/ScreenScrollView';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { colors, horizontalPadding, radii, typography } from '../../theme';
import type { MainTabParamList, TeacherTabParamList } from '../../navigation/types';

type Props =
  | BottomTabScreenProps<MainTabParamList, 'Settings'>
  | BottomTabScreenProps<TeacherTabParamList, 'Settings'>;

const TAB_BAR_SPACE = 100;

const ROW_ICON = 32;
const ROW_CHEVRON = 16;
const ROW_GAP = 10;
const ROW_DIVIDER_INSET = 4 + ROW_ICON + ROW_GAP;

export function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { signOut, user, applyServerProfileUpdate } = useAuth();
  const [pushOn, setPushOn] = useState(true);
  const [anon, setAnon] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    setPushOn(user.pushNotificationsEnabled);
    setAnon(user.anonymousMode);
  }, [user]);

  const persistPrefs = useCallback(
    async (next: { push?: boolean; anonymousMode?: boolean }) => {
      const body: Parameters<typeof api.updateProfile>[0] = {};
      if (typeof next.push === 'boolean') {
        const base = (user?.notificationPrefs as Record<string, unknown>) ?? {};
        body.notificationPrefs = { ...base, push: next.push };
        body.pushNotificationsEnabled = next.push;
      }
      if (typeof next.anonymousMode === 'boolean') {
        body.anonymousMode = next.anonymousMode;
      }
      const updated = await api.updateProfile(body);
      applyServerProfileUpdate(updated);
    },
    [user, applyServerProfileUpdate],
  );

  const performLogout = async () => {
    setLogoutConfirmOpen(false);
    await signOut();
    navigation.getParent()?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      }),
    );
  };

  const openAppSettings = () => {
    const parent = navigation.getParent() as
      | NavigationProp<ParamListBase>
      | undefined;
    parent?.navigate('AppSettings' as never);
  };

  return (
    <View style={styles.flex}>
      <ConfirmDialog
        visible={logoutConfirmOpen}
        title="Log out?"
        message="You will need to sign in again to use Student Voice."
        cancelLabel="No"
        confirmLabel="Yes"
        confirmTone="danger"
        onCancel={() => setLogoutConfirmOpen(false)}
        onConfirm={() => void performLogout()}
      />
      <AppHeader title="Settings" />
      <ScreenScrollView
        padded={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 20,
          paddingBottom: TAB_BAR_SPACE + insets.bottom,
          backgroundColor: colors.white,
          flexGrow: 1,
        }}>
        <Text style={styles.section}>Profile</Text>
        <View style={styles.card}>
          <Text style={styles.name}>{user?.fullName ?? '—'}</Text>
          <Text style={styles.meta}>{user?.email ?? ''}</Text>
          <Text style={styles.meta}>
            {user?.role === 'teacher' ? 'Staff ID' : 'Student ID'}: {user?.studentId ?? '—'}
          </Text>
        </View>

        <Text style={[styles.section, styles.mt]}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Image
              source={figmaIcons.settingsBellTile}
              style={styles.rowIcon}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
            <Text style={styles.rowLabel}>Push Notifications</Text>
            <Switch
              value={pushOn}
              onValueChange={async v => {
                setPushOn(v);
                try {
                  await persistPrefs({ push: v });
                } catch {
                  setPushOn(!v);
                }
              }}
              trackColor={{ false: colors.border, true: colors.accentGold }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.divider} />
          {user?.role !== 'teacher' ? (
            <View style={styles.row}>
              <Image
                source={figmaIcons.settingsShieldTile}
                style={styles.rowIcon}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
              <View style={styles.col}>
                <Text style={styles.rowLabel}>Anonymous Mode</Text>
                <Text style={styles.sub}>Submit feedback without your name</Text>
              </View>
              <Switch
                value={anon}
                onValueChange={async v => {
                  setAnon(v);
                  try {
                    await persistPrefs({ anonymousMode: v });
                  } catch {
                    setAnon(!v);
                  }
                }}
                trackColor={{ false: colors.border, true: colors.primaryRed }}
                thumbColor={colors.white}
              />
            </View>
          ) : null}
        </View>

        <Text style={[styles.section, styles.mt]}>App</Text>
        <View style={styles.card}>
          <Pressable style={styles.row} onPress={openAppSettings}>
            <Image
              source={figmaIcons.settingsGearTile}
              style={styles.rowIcon}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
            <Text style={[styles.rowLabel, { flex: 1 }]}>App Settings</Text>
            <Image
              source={figmaIcons.chevronRightMuted}
              style={styles.rowChevron}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </Pressable>
        </View>

        <Pressable style={styles.logout} onPress={() => setLogoutConfirmOpen(true)}>
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
    backgroundColor: colors.white,
  },
  section: {
    ...typography.bodyBold,
    fontSize: 15,
    lineHeight: 19,
    marginBottom: 8,
    color: colors.textPrimary,
  },
  mt: {
    marginTop: 20,
  },
  card: {
    backgroundColor: colors.inputFill,
    borderRadius: radii.xl,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  name: {
    ...typography.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.small,
    lineHeight: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 10,
    gap: ROW_GAP,
  },
  rowIcon: {
    width: ROW_ICON,
    height: ROW_ICON,
    borderRadius: radii.sm,
  },
  rowChevron: {
    width: ROW_CHEVRON,
    height: ROW_CHEVRON,
  },
  rowLabel: {
    ...typography.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
  },
  col: {
    flex: 1,
  },
  sub: {
    ...typography.navLabel,
    lineHeight: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: ROW_DIVIDER_INSET,
  },
  logout: {
    marginTop: 28,
    alignItems: 'center',
    padding: 14,
  },
  logoutText: {
    ...typography.bodyBold,
    fontSize: 14,
    color: colors.primaryRed,
  },
  version: {
    ...typography.navLabel,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
});

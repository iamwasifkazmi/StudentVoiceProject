import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthScreenScaffold } from '../../components/auth/AuthScreenScaffold';
import { AppHeader } from '../../components/navigation/AppHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TextField } from '../../components/ui/TextField';
import { api } from '../../services/api';
import { colors, typography } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AppSettings'>;

export function AppSettingsScreen({ navigation }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <AuthScreenScaffold
      header={
        <AppHeader title="App Settings" onBackPress={() => navigation.goBack()} />
      }>
      <View style={styles.form}>
        <Text style={[typography.subtitle, styles.introTitle]}>Change password</Text>
        <Text style={styles.intro}>
          Enter your current password, then choose a new one (at least 8 characters).
        </Text>
        <TextField
          label="Current password"
          passwordToggle
          placeholder="••••••••"
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextField
          label="New password"
          passwordToggle
          placeholder="••••••••"
          value={newPassword}
          onChangeText={setNewPassword}
          containerStyle={styles.gap}
        />
        <TextField
          label="Confirm new password"
          passwordToggle
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          containerStyle={styles.gap}
        />
        <PrimaryButton
          label="Update password"
          loading={loading}
          onPress={async () => {
            if (!currentPassword || !newPassword || !confirmPassword) {
              Alert.alert('Missing fields', 'Please fill in all password fields.');
              return;
            }
            if (newPassword.length < 8) {
              Alert.alert('Password', 'New password must be at least 8 characters.');
              return;
            }
            if (newPassword !== confirmPassword) {
              Alert.alert('Password', 'New password and confirmation do not match.');
              return;
            }
            try {
              setLoading(true);
              await api.changePassword({
                currentPassword,
                newPassword,
              });
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              Alert.alert('Password updated', 'You can continue using the app with your new password.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Could not update password';
              Alert.alert('Could not update password', msg);
            } finally {
              setLoading(false);
            }
          }}
          style={styles.btn}
        />
      </View>
    </AuthScreenScaffold>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  introTitle: {
    color: colors.textPrimary,
    marginBottom: 8,
  },
  intro: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  gap: {
    marginTop: 16,
  },
  btn: {
    marginTop: 28,
    width: '100%',
  },
});

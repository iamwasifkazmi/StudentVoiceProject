import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthScreenScaffold } from '../../components/auth/AuthScreenScaffold';
import { AppHeader } from '../../components/navigation/AppHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TextField } from '../../components/ui/TextField';
import { useAuth } from '../../context/AuthContext';
import { colors, radii, typography } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { registerAccount } = useAuth();
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <AuthScreenScaffold
      header={<AppHeader title="Sign Up" onBackPress={() => navigation.goBack()} />}
      footer={
        <>
          <Text style={styles.footerMuted}>Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </Pressable>
        </>
      }>
      <View style={styles.form}>
        <Text style={[typography.title, styles.heading]}>Create Account</Text>

        <Text style={styles.roleLabel}>I am a</Text>
        <View style={styles.roleRow}>
          <Pressable
            style={[styles.roleChip, role === 'student' && styles.roleChipOn]}
            onPress={() => setRole('student')}>
            <Text style={[styles.roleChipText, role === 'student' && styles.roleChipTextOn]}>
              Student
            </Text>
          </Pressable>
          <Pressable
            style={[styles.roleChip, role === 'teacher' && styles.roleChipOn]}
            onPress={() => setRole('teacher')}>
            <Text style={[styles.roleChipText, role === 'teacher' && styles.roleChipTextOn]}>
              Staff
            </Text>
          </Pressable>
        </View>
        <Text style={styles.roleHint}>
          {role === 'teacher'
            ? 'Staff review submissions and reply to students. Staff ID is optional.'
            : 'Students submit module feedback and track responses.'}
        </Text>

        <TextField
          label="Full Name"
          placeholder="John Doe"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextField
          label="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="john@example.com"
          value={email}
          onChangeText={setEmail}
          containerStyle={styles.gap}
        />
        <TextField
          label={role === 'teacher' ? 'Staff ID (optional)' : 'Student ID'}
          placeholder={role === 'teacher' ? 'e.g. STAFF-1024' : '2430001'}
          value={studentId}
          onChangeText={setStudentId}
          containerStyle={styles.gap}
        />
        <TextField
          label="Password"
          passwordToggle
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          containerStyle={styles.gap}
        />
        <TextField
          label="Confirm Password"
          passwordToggle
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          containerStyle={styles.gap}
        />
        <PrimaryButton
          label="Sign Up"
          loading={loading}
          variant="burnt"
          onPress={async () => {
            if (!fullName.trim() || !email.trim()) {
              Alert.alert('Missing information', 'Please enter your name and email.');
              return;
            }
            if (role === 'student' && !studentId.trim()) {
              Alert.alert('Missing information', 'Please enter your student ID.');
              return;
            }
            if (password.length < 8) {
              Alert.alert('Password', 'Password must be at least 8 characters.');
              return;
            }
            if (password !== confirmPassword) {
              Alert.alert('Password', 'Passwords do not match.');
              return;
            }
            try {
              setLoading(true);
              await registerAccount({
                fullName,
                email,
                studentId: studentId.trim() || undefined,
                password,
                role,
              });
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                }),
              );
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Registration failed';
              Alert.alert('Could not create account', msg);
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
  heading: {
    marginBottom: 16,
    color: colors.textPrimary,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  roleLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  roleChipOn: {
    borderColor: colors.accentGold,
    backgroundColor: colors.statusGoldMuted,
  },
  roleChipText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  roleChipTextOn: {
    color: colors.primaryRed,
  },
  roleHint: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  gap: {
    marginTop: 16,
  },
  btn: {
    marginTop: 28,
    width: '100%',
    borderRadius: radii.buttonFull,
  },
  footerMuted: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.caption,
    color: colors.linkTerracotta,
    fontWeight: '700',
  },
});

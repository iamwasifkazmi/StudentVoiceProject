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

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signInWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <AuthScreenScaffold
      header={<AppHeader title="Log In" onBackPress={() => navigation.goBack()} />}
      footer={
        <>
          <Text style={styles.footerMuted}>Don&apos;t have an account? </Text>
          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </Pressable>
        </>
      }>
      <View style={styles.form}>
        <Text style={[typography.title, styles.welcome]}>Welcome Back</Text>
        <TextField
          label="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="john@example.com"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="Password"
          passwordToggle
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          containerStyle={styles.fieldGap}
        />
        <Pressable
          style={styles.forgot}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </Pressable>
        <PrimaryButton
          label="Log In"
          loading={loading}
          onPress={async () => {
            if (!email.trim() || !password) {
              Alert.alert(
                'Missing information',
                'Please enter your email and password.',
              );
              return;
            }
            try {
              setLoading(true);
              await signInWithPassword(email, password);
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                }),
              );
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Login failed';
              Alert.alert('Could not sign in', msg);
            } finally {
              setLoading(false);
            }
          }}
          style={styles.loginBtn}
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
  welcome: {
    marginBottom: 28,
    color: colors.textPrimary,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  fieldGap: {
    marginTop: 16,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    ...typography.caption,
    color: colors.linkTerracotta,
    fontWeight: '600',
  },
  loginBtn: {
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

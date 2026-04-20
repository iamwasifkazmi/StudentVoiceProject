import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/navigation/AppHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TextField } from '../../components/ui/TextField';
import { useAuth } from '../../context/AuthContext';
import { colors, horizontalPadding, typography } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title="Log In" onBackPress={() => navigation.goBack()} />
      <View style={styles.centerArea}>
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
            secureTextEntry
            placeholder="••••••••"
            containerStyle={styles.fieldGap}
          />
          <Pressable
            style={styles.forgot}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>
          <PrimaryButton
            label="Log In"
            onPress={() => {
              signIn();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                }),
              );
            }}
            style={styles.loginBtn}
          />
        </View>
      </View>
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}>
        <Text style={styles.footerMuted}>Don&apos;t have an account? </Text>
        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: horizontalPadding,
    paddingVertical: 16,
  },
  form: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  welcome: {
    marginBottom: 28,
    color: colors.textPrimary,
    textAlign: 'center',
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
    color: colors.primaryOrange,
    fontWeight: '600',
  },
  loginBtn: {
    marginTop: 28,
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: horizontalPadding,
    paddingTop: 12,
  },
  footerMuted: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.caption,
    color: colors.primaryRed,
    fontWeight: '700',
  },
});

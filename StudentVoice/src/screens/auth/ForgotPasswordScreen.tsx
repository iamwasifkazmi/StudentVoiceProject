import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthScreenScaffold } from '../../components/auth/AuthScreenScaffold';
import { AppHeader } from '../../components/navigation/AppHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TextField } from '../../components/ui/TextField';
import { api } from '../../services/api';
import { colors, typography } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <AuthScreenScaffold
      header={
        <AppHeader
          title="Forgot Password"
          onBackPress={() => navigation.goBack()}
        />
      }
      footer={
        <>
          <Text style={styles.footerMuted}>Remember your password? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Log In</Text>
          </Pressable>
        </>
      }>
      <View style={styles.form}>
        <Text style={[typography.body, styles.intro]}>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </Text>
        <TextField
          label="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="john@example.com"
          value={email}
          onChangeText={setEmail}
        />
        <PrimaryButton
          label="Send reset link"
          loading={loading}
          onPress={async () => {
            if (!email.trim()) {
              Alert.alert('Email required', 'Please enter your email address.');
              return;
            }
            try {
              setLoading(true);
              const res = await api.forgotPassword(email.trim());
              Alert.alert('Request sent', res.message, [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Request failed';
              Alert.alert('Error', msg);
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
  intro: {
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  btn: {
    marginTop: 24,
    width: '100%',
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

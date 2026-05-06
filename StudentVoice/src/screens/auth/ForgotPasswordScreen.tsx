import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/navigation/AppHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TextField } from '../../components/ui/TextField';
import { api } from '../../services/api';
import { colors, horizontalPadding, typography } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader
        title="Forgot Password"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.centerArea}>
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
      </View>
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}>
        <Text style={styles.footerMuted}>Remember your password? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Log In</Text>
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
  intro: {
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  btn: {
    marginTop: 24,
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

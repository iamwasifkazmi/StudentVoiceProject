import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppHeader } from '../../components/navigation/AppHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TextField } from '../../components/ui/TextField';
import { colors, horizontalPadding, typography } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader
        title="Forgot Password"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.body}>
        <Text style={[typography.body, styles.intro]}>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </Text>
        <TextField
          label="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="john@example.com"
        />
        <PrimaryButton
          label="Send reset link"
          onPress={() => navigation.goBack()}
          style={styles.btn}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    paddingHorizontal: horizontalPadding,
    paddingTop: 24,
  },
  intro: {
    color: colors.textSecondary,
    marginBottom: 20,
  },
  btn: {
    marginTop: 24,
    width: '100%',
  },
});

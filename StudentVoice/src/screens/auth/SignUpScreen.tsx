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

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title="Sign Up" onBackPress={() => navigation.goBack()} />
      <View style={styles.centerArea}>
        <View style={styles.form}>
          <Text style={[typography.title, styles.heading]}>Create Account</Text>
          <TextField
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
          />
          <TextField
            label="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="john@example.com"
            containerStyle={styles.gap}
          />
          <TextField
            label="Password"
            secureTextEntry
            placeholder="••••••••"
            containerStyle={styles.gap}
          />
          <PrimaryButton
            label="Sign Up"
            onPress={() => {
              signIn(name || 'Student');
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                }),
              );
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
        <Text style={styles.footerMuted}>Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Sign In</Text>
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
  heading: {
    marginBottom: 28,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  gap: {
    marginTop: 16,
  },
  btn: {
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

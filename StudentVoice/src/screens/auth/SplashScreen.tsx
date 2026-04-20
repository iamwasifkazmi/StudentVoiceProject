import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { colors, horizontalPadding, typography } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.gradientOrangeTop, colors.gradientRedBottom]}
      style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        <Text style={[typography.hero, styles.title]}>Student Voice</Text>
      </View>
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 20), paddingHorizontal: horizontalPadding },
        ]}>
        <PrimaryButton
          label="Log In"
          variant="orange"
          onPress={() => navigation.navigate('Login')}
          style={styles.btn}
        />
        <PrimaryButton
          label="Sign Up"
          variant="white"
          onPress={() => navigation.navigate('SignUp')}
          style={styles.btn}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    textAlign: 'center',
  },
  footer: {
    gap: 12,
  },
  btn: {
    width: '100%',
  },
});

import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { figmaIcons } from '../../assets/figmaIcons';
import { colors, horizontalPadding, radii } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isReady, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (isLoggedIn) {
      navigation.replace('Main');
    }
  }, [isReady, isLoggedIn, navigation]);

  return (
    <LinearGradient
      colors={[colors.gradientSplashTop, colors.gradientSplashBottom]}
      style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        <Image
          accessibilityIgnoresInvertColors
          source={figmaIcons.splashBrandMark}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      {isReady && isLoggedIn ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      ) : null}
      {isReady && !isLoggedIn ? (
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
      ) : null}
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
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  footer: {
    gap: 12,
  },
  btn: {
    width: '100%',
    borderRadius: radii.buttonFull,
  },
});

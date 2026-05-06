import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS = 'sv_access_token';
const REFRESH = 'sv_refresh_token';

export async function saveTokens(access: string, refresh: string) {
  await AsyncStorage.setItem(ACCESS, access);
  await AsyncStorage.setItem(REFRESH, refresh);
}

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH);
}

export async function clearTokens() {
  await AsyncStorage.removeItem(ACCESS);
  await AsyncStorage.removeItem(REFRESH);
}

import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS = 'sv_access_token';
const REFRESH = 'sv_refresh_token';

/** Used when the native AsyncStorage module is not linked (rebuild iOS/Android after install). */
const memoryFallback = new Map<string, string>();

async function set(key: string, value: string) {
  memoryFallback.set(key, value);
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    /* native module missing until pod install + rebuild */
  }
}

async function get(key: string): Promise<string | null> {
  try {
    const v = await AsyncStorage.getItem(key);
    if (v != null) {
      memoryFallback.set(key, v);
    }
    return v;
  } catch {
    return memoryFallback.get(key) ?? null;
  }
}

async function removeKey(key: string) {
  memoryFallback.delete(key);
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    /* see set() */
  }
}

export async function saveTokens(access: string, refresh: string) {
  await set(ACCESS, access);
  await set(REFRESH, refresh);
}

export async function getAccessToken(): Promise<string | null> {
  return get(ACCESS);
}

export async function getRefreshToken(): Promise<string | null> {
  return get(REFRESH);
}

export async function clearTokens() {
  await removeKey(ACCESS);
  await removeKey(REFRESH);
}

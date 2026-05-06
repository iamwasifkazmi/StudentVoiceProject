import { Platform } from 'react-native';

/**
 * API base URL including `/api` suffix.
 * Android emulator: use 10.0.2.2 to reach host machine's localhost.
 * Physical device: set your machine LAN IP (same Wi‑Fi) or deployed API URL.
 */
const DEV_HOST = Platform.select({
  android: '10.0.2.2',
  ios: 'localhost',
  default: 'localhost',
});

export const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:3000/api`
  : 'https://your-api.example.com/api';

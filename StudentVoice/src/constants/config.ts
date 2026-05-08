import { Platform } from 'react-native';
import { API_BASE_URL as ENV_API_URL } from '@env';

/**
 * API base URL including `/api` suffix.
 *
 * Priority:
 * 1. `StudentVoice/.env` → `API_BASE_URL` (loaded at bundle time; restart Metro with `--reset-cache` after edits)
 * 2. Development default if unset: iOS `localhost`, Android emulator `10.0.2.2`, port 3000
 * 3. Production build default: deployed API (override via `.env` before `yarn ios --configuration Release` / `assembleRelease`)
 */
const DEV_HOST = Platform.select({
  android: '10.0.2.2',
  ios: 'localhost',
  default: 'localhost',
});

const devFallback = `http://${DEV_HOST}:3000/api`;

const PRODUCTION_DEFAULT = 'https://student-voice-api.vercel.app/api';

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/$/, '');
}

const fromEnv =
  typeof ENV_API_URL === 'string' && ENV_API_URL.trim().length > 0
    ? normalizeBaseUrl(ENV_API_URL)
    : null;

export const API_BASE_URL =
  fromEnv ?? (__DEV__ ? devFallback : PRODUCTION_DEFAULT);

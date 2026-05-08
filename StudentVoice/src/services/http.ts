import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants/config';
import * as storage from './storage';
import { authBridge } from './authBridge';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25_000,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthHeader(token: string | null) {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const rt = await storage.getRefreshToken();
  if (!rt) {
    return null;
  }
  const res = await axios.post<{ success: boolean; data?: { accessToken: string; refreshToken: string } }>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken: rt },
    { headers: { 'Content-Type': 'application/json' } },
  );
  if (!res.data.success || !res.data.data) {
    return null;
  }
  const { accessToken, refreshToken } = res.data.data;
  await storage.saveTokens(accessToken, refreshToken);
  setAuthHeader(accessToken);
  return accessToken;
}

/** Call on app launch: set Authorization from stored access token, or refresh if access is missing. */
export async function bootstrapAuthHeaderFromStorage(): Promise<boolean> {
  const access = await storage.getAccessToken();
  if (access) {
    setAuthHeader(access);
    return true;
  }
  const refresh = await storage.getRefreshToken();
  if (!refresh) {
    return false;
  }
  try {
    return Boolean(await refreshAccessToken());
  } catch {
    return false;
  }
}

http.interceptors.response.use(
  r => r,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }
    const url = original.url ?? '';
    if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }
    original._retry = true;
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newAccess = await refreshPromise;
      if (!newAccess) {
        await storage.clearTokens();
        setAuthHeader(null);
        authBridge.current?.clearSession();
        return Promise.reject(error);
      }
      original.headers.Authorization = `Bearer ${newAccess}`;
      return http(original);
    } catch {
      await storage.clearTokens();
      setAuthHeader(null);
      authBridge.current?.clearSession();
      return Promise.reject(error);
    }
  },
);

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api, type AuthUser } from '../services/api';
import { authBridge } from '../services/authBridge';
import { bootstrapAuthHeaderFromStorage, setAuthHeader } from '../services/http';
import * as storage from '../services/storage';
import { resolveAccountRole } from '../utils/userRole';

type AuthContextValue = {
  isReady: boolean;
  isLoggedIn: boolean;
  user: AuthUser | null;
  userName: string;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  registerAccount: (input: {
    fullName: string;
    email: string;
    studentId?: string;
    password: string;
    role?: 'student' | 'teacher';
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  /** Merge fields from PUT /user/profile (avoids stale GET flipping toggles). */
  applyServerProfileUpdate: (
    patch: Awaited<ReturnType<typeof api.updateProfile>>,
  ) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeProfile(u: storage.CachedAuthUser | AuthUser): AuthUser {
  const role = resolveAccountRole(u);
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    studentId: u.studentId,
    role,
    anonymousMode: u.anonymousMode ?? false,
    pushNotificationsEnabled: u.pushNotificationsEnabled ?? true,
    notificationPrefs: u.notificationPrefs,
    createdAt: u.createdAt,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const applySession = useCallback(async (access: string, refresh: string) => {
    await storage.saveTokens(access, refresh);
    setAuthHeader(access);
    const profile = await api.getProfile();
    const normalized = normalizeProfile(profile);
    await storage.saveUserCache(normalized);
    setUser(normalized);
    setIsLoggedIn(true);
  }, []);

  const clearLocal = useCallback(async () => {
    await storage.clearTokens();
    setAuthHeader(null);
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    authBridge.current = {
      clearSession: () => {
        void clearLocal();
      },
    };
    return () => {
      authBridge.current = null;
    };
  }, [clearLocal]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cachedUser = await storage.getUserCache();
        const hasAuth = await bootstrapAuthHeaderFromStorage();
        if (!hasAuth) {
          return;
        }
        try {
          const profile = await api.getProfile();
          const normalized = normalizeProfile(profile);
          if (!cancelled) {
            await storage.saveUserCache(normalized);
            setUser(normalized);
            setIsLoggedIn(true);
          }
        } catch {
          const stillHas = Boolean(
            (await storage.getAccessToken()) || (await storage.getRefreshToken()),
          );
          if (!cancelled) {
            if (stillHas) {
              if (cachedUser) {
                setUser(normalizeProfile(cachedUser));
              }
              setIsLoggedIn(true);
            } else {
              await clearLocal();
            }
          }
        }
      } catch {
        await clearLocal();
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clearLocal]);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const res = await api.login(email.trim(), password);
      await applySession(res.accessToken, res.refreshToken);
    },
    [applySession],
  );

  const registerAccount = useCallback(
    async (input: {
      fullName: string;
      email: string;
      studentId?: string;
      password: string;
      role?: 'student' | 'teacher';
    }) => {
      const res = await api.register({
        fullName: input.fullName.trim(),
        email: input.email.trim(),
        studentId: input.studentId?.trim(),
        password: input.password,
        role: input.role ?? 'student',
      });
      await applySession(res.accessToken, res.refreshToken);
    },
    [applySession],
  );

  const signOut = useCallback(async () => {
    await clearLocal();
  }, [clearLocal]);

  const refreshProfile = useCallback(async () => {
    if (!isLoggedIn) {
      return;
    }
    try {
      const profile = await api.getProfile();
      const normalized = normalizeProfile(profile);
      setUser(normalized);
      await storage.saveUserCache(normalized);
    } catch {
      /* keep last known user */
    }
  }, [isLoggedIn]);

  const applyServerProfileUpdate = useCallback(
    (patch: Awaited<ReturnType<typeof api.updateProfile>>) => {
      setUser(prev => {
        if (!prev) {
          return prev;
        }
        const merged = normalizeProfile({
          ...prev,
          ...patch,
          createdAt: prev.createdAt,
        });
        void storage.saveUserCache(merged);
        return merged;
      });
    },
    [],
  );

  const userName = user?.fullName ?? 'Student';

  const value = useMemo(
    () => ({
      isReady,
      isLoggedIn,
      user,
      userName,
      signInWithPassword,
      registerAccount,
      signOut,
      refreshProfile,
      applyServerProfileUpdate,
    }),
    [
      isReady,
      isLoggedIn,
      user,
      userName,
      signInWithPassword,
      registerAccount,
      signOut,
      refreshProfile,
      applyServerProfileUpdate,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

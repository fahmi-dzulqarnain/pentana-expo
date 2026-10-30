import { useQueryClient } from '@tanstack/react-query';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { type ApiClient, createApiClient } from '@/api/client';
import type { LoginResponse } from '@/api/types';
import { API_URL } from '@/config';

import { tokenStore } from './tokenStore';

type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

type AuthContextValue = {
  status: AuthStatus;
  api: ApiClient;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  // undefined while the saved token is still being read from secure storage.
  const [token, setToken] = useState<string | null | undefined>(undefined);

  const clearSession = useCallback(async () => {
    await tokenStore.clear();
    queryClient.clear();
    setToken(null);
  }, [queryClient]);

  // Rebuilt when the token changes, so every request carries the current one.
  const api = useMemo(
    () => createApiClient({ baseUrl: API_URL, getToken: () => token ?? null, onUnauthorized: () => void clearSession() }),
    [token, clearSession],
  );

  useEffect(() => {
    // If storage can't be read, start signed out rather than stuck on the loading screen.
    tokenStore
      .read()
      .catch(() => null)
      .then(saved => setToken(saved));
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<LoginResponse>('/login', { email, password, device_name: `expo-${Platform.OS}` });
      await tokenStore.write(res.token);
      setToken(res.token);
    },
    [api],
  );

  const signOut = useCallback(async () => {
    // Revoke the token server-side, but sign out locally even if that call fails.
    await api.post('/logout').catch(() => undefined);
    await clearSession();
  }, [api, clearSession]);

  const status: AuthStatus = token === undefined ? 'loading' : token ? 'signedIn' : 'signedOut';
  const value = useMemo(() => ({ status, api, signIn, signOut }), [status, api, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

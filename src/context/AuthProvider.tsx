import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '../api/auth';
import { onUnauthorized, setAuthToken } from '../api/client';
import type { AuthResponse, SignInPayload, SignUpPayload, User } from '../types/auth';
import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context';

const TOKEN_KEY = 'retain.token';

const readStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const storeToken = (token: string | null): void => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage can be unavailable in private mode; the session then lasts until reload
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    readStoredToken() ? 'loading' : 'unauthenticated',
  );

  const signOut = useCallback(() => {
    storeToken(null);
    setAuthToken(null);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const startSession = useCallback(({ token, user: nextUser }: AuthResponse): User => {
    storeToken(token);
    setAuthToken(token);
    setUser(nextUser);
    setStatus('authenticated');
    return nextUser;
  }, []);

  // Restore the session from a stored token on first load
  useEffect(() => {
    const token = readStoredToken();
    if (!token) return;

    const controller = new AbortController();
    setAuthToken(token);
    authApi
      .me(controller.signal)
      .then(({ user: restoredUser }) => {
        setUser(restoredUser);
        setStatus('authenticated');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        signOut();
      });

    return () => controller.abort();
  }, [signOut]);

  useEffect(() => {
    onUnauthorized(signOut);
    return () => onUnauthorized(null);
  }, [signOut]);

  const signIn = useCallback(
    async (payload: SignInPayload) => startSession(await authApi.signIn(payload)),
    [startSession],
  );

  const signUp = useCallback(
    async (payload: SignUpPayload) => startSession(await authApi.signUp(payload)),
    [startSession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, isAdmin: user?.role === 'ADMIN', signIn, signUp, signOut }),
    [user, status, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

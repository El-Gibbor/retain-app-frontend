import { createContext } from 'react';
import type { SignInPayload, SignUpPayload, User } from '../types/auth';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  isAdmin: boolean;
  signIn: (payload: SignInPayload) => Promise<User>;
  signUp: (payload: SignUpPayload) => Promise<User>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

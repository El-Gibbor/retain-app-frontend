import type { AuthResponse, SignInPayload, SignUpPayload, User } from '../types/auth';
import { request } from './client';

export const authApi = {
  signUp: (payload: SignUpPayload) =>
    request<AuthResponse>('/auth/signup', { method: 'POST', body: payload }),
  signIn: (payload: SignInPayload) =>
    request<AuthResponse>('/auth/signin', { method: 'POST', body: payload }),
  me: (signal?: AbortSignal) => request<{ user: User }>('/auth/me', { signal }),
};

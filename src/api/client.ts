const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export interface ApiErrorBody {
  error: {
    message: string;
    details?: Record<string, string[]>;
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly details?: Record<string, string[]>;

  constructor(status: number, message: string, details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type QueryValue = string | number | boolean | string[] | undefined | null;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
}

// Free hosting tiers sleep when idle, so a request this slow usually means the API is waking up
const SLOW_REQUEST_MS = 4000;

let slowRequests = 0;
const slowListeners = new Set<() => void>();

const setSlowRequests = (next: number) => {
  slowRequests = next;
  slowListeners.forEach((listener) => listener());
};

/** useSyncExternalStore source for "a request has been pending for a while" */
export const slowRequestStore = {
  subscribe(listener: () => void) {
    slowListeners.add(listener);
    return () => slowListeners.delete(listener);
  },
  getSnapshot: () => slowRequests > 0,
};

let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export const setAuthToken = (token: string | null): void => {
  authToken = token;
};

// Lets the auth layer sign the user out when the API rejects their token
export const onUnauthorized = (handler: (() => void) | null): void => {
  unauthorizedHandler = handler;
};

const buildUrl = (path: string, query?: RequestOptions['query']): string => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(','));
    } else {
      params.set(key, String(value));
    }
  }
  const search = params.toString();
  return `${API_URL}${path}${search ? `?${search}` : ''}`;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, signal } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  let markedSlow = false;
  const slowTimer = window.setTimeout(() => {
    markedSlow = true;
    setSlowRequests(slowRequests + 1);
  }, SLOW_REQUEST_MS);

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, 'Unable to reach the server. Check your connection and try again.');
  } finally {
    window.clearTimeout(slowTimer);
    if (markedSlow) setSlowRequests(slowRequests - 1);
  }

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = (data as ApiErrorBody | null)?.error;
    if (response.status === 401 && authToken) unauthorizedHandler?.();
    throw new ApiError(
      response.status,
      errorBody?.message ?? `Request failed with status ${response.status}`,
      errorBody?.details,
    );
  }

  return data as T;
}

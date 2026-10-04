import { ApiResponse } from '../types/api';
import { API_BASE_URL } from '../lib/constants';

type AuthTokenGetter = () => Promise<string | null>;

let authTokenGetter: AuthTokenGetter | null = null;

export const setAuthTokenGetter = (getter: AuthTokenGetter | null) => {
  authTokenGetter = getter;
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = authTokenGetter ? await authTokenGetter() : null;
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    const responseText = await response.text();
    let envelope: ApiResponse<T> | null = null;

    if (responseText) {
      try {
        envelope = JSON.parse(responseText) as ApiResponse<T>;
      } catch {
        throw {
          code: 'INVALID_RESPONSE',
          message: 'The server returned an invalid response.',
        };
      }
    }

    if (!response.ok) {
      throw {
        code: envelope?.error?.code || 'UNKNOWN_ERROR',
        message: envelope?.error?.message || 'An unexpected error occurred',
      };
    }

    if (!envelope) {
      throw {
        code: 'EMPTY_RESPONSE',
        message: 'The server returned an empty response.',
      };
    }

    return envelope;
  } catch (error: unknown) {
    const apiError = error as { code?: string; message?: string };
    return {
      success: false,
      data: null,
      error: {
        code: apiError.code || 'NETWORK_ERROR',
        message: apiError.message || 'Failed to connect to server',
      },
    };
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

import { ApiResponse } from '../types/api';
import { API_BASE_URL } from '../lib/constants';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (options.headers) {
    for (const [k, v] of Object.entries(options.headers)) {
      headers[k] = String(v);
    }
  }

  // When the frontend makes authenticated API calls, it must include the
  // Clerk session token via the `Authorization: Bearer <token>` header.
  // That is done by calling `getToken()` from `@clerk/clerk-react`'s
  // `useAuth()` hook at the call site and passing it here. This wrapper
  // does not retrieve the token automatically to avoid coupling every
  // request to Clerk; callers that need auth should inject the header.
  // Example when /api/me is added:
  //   api.get('/me', { headers: { Authorization: `Bearer ${await getToken()}` } })


  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw {
        code: data.error?.code || 'UNKNOWN_ERROR',
        message: data.error?.message || 'An unexpected error occurred',
      };
    }

    return { success: true, data, error: null };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: {
        code: error.code || 'NETWORK_ERROR',
        message: error.message || 'Failed to connect to server',
      },
    };
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

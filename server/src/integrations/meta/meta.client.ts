import axios, { AxiosError } from 'axios';
import { config } from '../../config/env';

const graphVersion = () => config.META_GRAPH_API_VERSION || 'v21.0';

export const graphBaseUrl = () =>
  `https://graph.facebook.com/${graphVersion()}`;

export class MetaApiError extends Error {
  status?: number;
  metaCode?: string;

  constructor(message: string, status?: number, metaCode?: string) {
    super(message);
    this.name = 'MetaApiError';
    this.status = status;
    this.metaCode = metaCode;
  }
}

const toMetaError = (error: unknown): MetaApiError => {
  if (error instanceof MetaApiError) return error;
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      error?: { message?: string; code?: number | string };
    }>;
    const payload = axiosError.response?.data?.error;
    return new MetaApiError(
      payload?.message || axiosError.message || 'Meta Graph API request failed',
      axiosError.response?.status,
      payload?.code !== undefined ? String(payload.code) : undefined,
    );
  }
  return new MetaApiError(
    error instanceof Error ? error.message : 'Meta Graph API request failed',
  );
};

export const metaGet = async <T>(
  path: string,
  params: Record<string, string | undefined> = {},
): Promise<T> => {
  try {
    const response = await axios.get<T>(`${graphBaseUrl()}${path}`, {
      params: Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined),
      ),
    });
    return response.data;
  } catch (error) {
    throw toMetaError(error);
  }
};

export const metaPost = async <T>(
  path: string,
  body: Record<string, string | undefined> = {},
): Promise<T> => {
  try {
    const response = await axios.post<T>(`${graphBaseUrl()}${path}`, undefined, {
      params: Object.fromEntries(
        Object.entries(body).filter(([, value]) => value !== undefined),
      ),
    });
    return response.data;
  } catch (error) {
    throw toMetaError(error);
  }
};

import https from 'https';
import axios, { AxiosError } from 'axios';
import { config } from '../../config/env';

const insecureTls =
  process.env.META_TLS_INSECURE === 'true' ||
  (process.env.NODE_ENV || config.NODE_ENV || 'development') === 'development';

const httpsAgent = insecureTls
  ? new https.Agent({ family: 4, keepAlive: true, rejectUnauthorized: false })
  : new https.Agent({ family: 4, keepAlive: true });

const META_REQUEST_TIMEOUT_MS = 20_000;

const graphVersion = () => config.META_GRAPH_API_VERSION || 'v21.0';
const instagramGraphVersion = () =>
  config.META_IG_GRAPH_API_VERSION || 'v21.0';

export type MetaGraphHost = 'facebook' | 'instagram';

export const graphBaseUrl = () =>
  `https://graph.facebook.com/${graphVersion()}`;

export const instagramGraphBaseUrl = () =>
  `https://graph.instagram.com/${instagramGraphVersion()}`;

const hostBaseUrl = (host: MetaGraphHost = 'facebook'): string =>
  host === 'instagram' ? instagramGraphBaseUrl() : graphBaseUrl();

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
  host: MetaGraphHost = 'facebook',
): Promise<T> => {
  try {
    const response = await axios.get<T>(`${hostBaseUrl(host)}${path}`, {
      httpsAgent,
      timeout: META_REQUEST_TIMEOUT_MS,
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
  host: MetaGraphHost = 'facebook',
): Promise<T> => {
  try {
    const response = await axios.post<T>(`${hostBaseUrl(host)}${path}`, undefined, {
      httpsAgent,
      timeout: META_REQUEST_TIMEOUT_MS,
      params: Object.fromEntries(
        Object.entries(body).filter(([, value]) => value !== undefined),
      ),
    });
    return response.data;
  } catch (error) {
    throw toMetaError(error);
  }
};

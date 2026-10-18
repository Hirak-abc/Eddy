import crypto from 'crypto';
import { config } from '../../config/env';
import { META_OAUTH_SCOPES } from '../../config/constants';
import { graphBaseUrl, metaGet } from './meta.client';

export interface OAuthStatePayload {
  clerkUserId: string;
  nonce: string;
  exp: number;
}

export interface DiscoveredMetaAccount {
  platform: 'FACEBOOK_PAGE' | 'INSTAGRAM';
  externalId: string;
  name?: string;
  username?: string;
  accessToken: string;
  tokenExpiresAt?: number;
}

interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

interface PageAccount {
  id: string;
  name?: string;
  access_token?: string;
  instagram_business_account?: { id: string; username?: string };
}

interface AccountsResponse {
  data?: PageAccount[];
}

const base64UrlEncode = (value: string): string =>
  Buffer.from(value, 'utf8').toString('base64url');

const base64UrlDecode = (value: string): string =>
  Buffer.from(value, 'base64url').toString('utf8');

export const isMetaConfigured = (): boolean =>
  Boolean(
    config.META_APP_ID &&
      config.META_APP_SECRET &&
      config.META_REDIRECT_URI &&
      config.META_STATE_SECRET &&
      config.META_TOKEN_ENCRYPTION_KEY,
  );

export const isMetaPublishingConfigured = (): boolean =>
  Boolean(
    ((process.env.META_PAGE_ID || config.META_PAGE_ID) &&
      (process.env.META_PAGE_ACCESS_TOKEN || config.META_PAGE_ACCESS_TOKEN)) ||
      ((process.env.META_IG_USER_ID || config.META_IG_USER_ID) &&
        (process.env.META_IG_ACCESS_TOKEN || config.META_IG_ACCESS_TOKEN)) ||
      isMetaConfigured(),
  );

export const createOAuthState = (clerkUserId: string): string => {
  const secret = config.META_STATE_SECRET;
  if (!secret) {
    throw new Error('META_STATE_SECRET is not configured');
  }
  const payload: OAuthStatePayload = {
    clerkUserId,
    nonce: crypto.randomBytes(16).toString('hex'),
    exp: Date.now() + 10 * 60 * 1000,
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
};

export const parseOAuthState = (state: string): OAuthStatePayload => {
  const secret = config.META_STATE_SECRET;
  if (!secret) {
    throw new Error('META_STATE_SECRET is not configured');
  }
  const [encoded, signature] = state.split('.');
  if (!encoded || !signature) {
    throw new Error('Malformed OAuth state');
  }
  const expected = crypto
    .createHmac('sha256', secret)
    .update(encoded)
    .digest('base64url');
  const provided = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (
    provided.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(provided, expectedBuf)
  ) {
    throw new Error('Invalid OAuth state signature');
  }
  const payload = JSON.parse(base64UrlDecode(encoded)) as OAuthStatePayload;
  if (!payload.clerkUserId || payload.exp < Date.now()) {
    throw new Error('OAuth state expired');
  }
  return payload;
};

export const buildAuthorizationUrl = (state: string): string => {
  const params = new URLSearchParams({
    client_id: config.META_APP_ID || '',
    redirect_uri: config.META_REDIRECT_URI || '',
    state,
    response_type: 'code',
    scope: META_OAUTH_SCOPES,
  });
  return `https://www.facebook.com/${config.META_GRAPH_API_VERSION || 'v21.0'}/dialog/oauth?${params.toString()}`;
};

export const exchangeCodeForUserToken = async (
  code: string,
): Promise<TokenResponse> => {
  return metaGet<TokenResponse>('/oauth/access_token', {
    client_id: config.META_APP_ID,
    client_secret: config.META_APP_SECRET,
    redirect_uri: config.META_REDIRECT_URI,
    code,
  });
};

export const exchangeLongLivedUserToken = async (
  shortLivedToken: string,
): Promise<TokenResponse> => {
  return metaGet<TokenResponse>('/oauth/access_token', {
    grant_type: 'fb_exchange_token',
    client_id: config.META_APP_ID,
    client_secret: config.META_APP_SECRET,
    fb_exchange_token: shortLivedToken,
  });
};

export const discoverConnectedAccounts = async (
  userAccessToken: string,
  tokenExpiresAt?: number,
): Promise<DiscoveredMetaAccount[]> => {
  const pages = await metaGet<AccountsResponse>('/me/accounts', {
    access_token: userAccessToken,
    fields: 'id,name,access_token,instagram_business_account{id,username}',
  });

  const discovered: DiscoveredMetaAccount[] = [];
  for (const page of pages.data || []) {
    if (!page.id || !page.access_token) continue;
    discovered.push({
      platform: 'FACEBOOK_PAGE',
      externalId: page.id,
      name: page.name,
      accessToken: page.access_token,
      tokenExpiresAt,
    });
    if (page.instagram_business_account?.id) {
      discovered.push({
        platform: 'INSTAGRAM',
        externalId: page.instagram_business_account.id,
        name: page.name,
        username: page.instagram_business_account.username,
        accessToken: page.access_token,
        tokenExpiresAt,
      });
    }
  }
  return discovered;
};

export const graphHealthUrl = (): string => graphBaseUrl();

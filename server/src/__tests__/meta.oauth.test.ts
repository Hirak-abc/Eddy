import { describe, expect, it, vi } from 'vitest';
import * as metaClient from '../integrations/meta/meta.client';

vi.mock('../config/env', () => ({
  config: {
    META_APP_ID: 'test-app-id',
    META_REDIRECT_URI: 'https://eddy.test/api/social/meta/callback',
    META_GRAPH_API_VERSION: 'v26.0',
  },
}));

import {
  buildAuthorizationUrl,
  discoverConnectedAccounts,
} from '../integrations/meta/meta.oauth';

describe('Meta authorization URL', () => {
  it('re-requests Meta permissions when connecting or reconnecting', () => {
    const authorizationUrl = new URL(buildAuthorizationUrl('signed-state'));

    expect(authorizationUrl.searchParams.get('auth_type')).toBe('rerequest');
    expect(authorizationUrl.searchParams.get('state')).toBe('signed-state');
    expect(authorizationUrl.searchParams.get('scope')).toContain('pages_show_list');
    expect(authorizationUrl.searchParams.get('scope')).toContain('pages_manage_posts');
    expect(authorizationUrl.searchParams.get('scope')).toContain('business_management');
  });
});

describe('Meta account discovery', () => {
  it('includes Pages assigned through business portfolios', async () => {
    const responses: Record<string, unknown> = {
      '/me/accounts': {
        data: [
          {
            id: 'eddy-page',
            name: 'EddyOfficial',
            access_token: 'eddy-page-token',
          },
        ],
      },
      '/me/businesses': { data: [{ id: 'business-1' }] },
      '/business-1/owned_pages': {
        data: [
          {
            id: 'devtest-page',
            name: 'DevTest',
            access_token: 'devtest-page-token',
          },
        ],
      },
      '/business-1/client_pages': {
        data: [
          {
            id: 'devtest-page',
            name: 'DevTest',
            access_token: 'devtest-page-token',
          },
        ],
      },
    };
    vi.spyOn(metaClient, 'metaGet').mockImplementation(
      async <T>(path: string): Promise<T> => {
        const response = responses[path];
        if (response === undefined) throw new Error(`Unexpected Meta path: ${path}`);
        return response as T;
      },
    );

    const accounts = await discoverConnectedAccounts('user-token');

    expect(accounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          platform: 'FACEBOOK_PAGE',
          externalId: 'eddy-page',
          accessToken: 'eddy-page-token',
        }),
        expect.objectContaining({
          platform: 'FACEBOOK_PAGE',
          externalId: 'devtest-page',
          accessToken: 'devtest-page-token',
        }),
      ]),
    );
    expect(accounts).toHaveLength(2);
  });
});

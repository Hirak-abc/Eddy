import { afterEach, describe, expect, it, vi } from 'vitest';
import { SOCIAL_REPOSITORY } from '../modules/social/social.repository';
import { SOCIAL_SERVICE } from '../modules/social/social.service';
import type { SocialAccountRecord } from '../modules/social/social.types';

vi.mock('../config/env', () => ({
  config: {
    META_APP_ID: 'test-app-id',
    META_APP_SECRET: 'test-app-secret',
    META_REDIRECT_URI: 'https://eddy.test/meta/callback',
    META_STATE_SECRET: 'test-state-secret',
    META_TOKEN_ENCRYPTION_KEY: 'test-encryption-key',
    META_IG_USER_ID: undefined,
    META_IG_USERNAME: undefined,
    META_IG_ACCESS_TOKEN: undefined,
  },
}));

const account: SocialAccountRecord = {
  id: 'account-1',
  clerkUserId: 'owner-1',
  platform: 'FACEBOOK_PAGE',
  externalId: 'page-1',
  name: 'Owner page',
  encryptedAccessToken: 'encrypted-token',
  autoPublish: true,
  status: 'ACTIVE',
  createdAt: '2026-10-20T00:00:00.000Z',
  updatedAt: '2026-10-20T00:00:00.000Z',
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('owner social connections', () => {
  it('lists only accounts stored for the owner', async () => {
    const listAccounts = vi
      .spyOn(SOCIAL_REPOSITORY, 'listAccounts')
      .mockResolvedValue([account]);

    await expect(SOCIAL_SERVICE.listAccounts('owner-1')).resolves.toEqual([
      {
        id: account.id,
        platform: account.platform,
        externalId: account.externalId,
        name: account.name,
        username: account.username,
        tokenExpiresAt: account.tokenExpiresAt,
        autoPublish: account.autoPublish,
        isSelected: true,
        status: account.status,
      },
    ]);
    expect(listAccounts).toHaveBeenCalledWith('owner-1');
  });

  it('disconnects an account owned by the requesting owner', async () => {
    vi.spyOn(SOCIAL_REPOSITORY, 'getAccountById').mockResolvedValue(account);
    const updateAccount = vi
      .spyOn(SOCIAL_REPOSITORY, 'updateAccount')
      .mockResolvedValue();

    await SOCIAL_SERVICE.disconnectAccount('owner-1', account.id);

    expect(updateAccount).toHaveBeenCalledWith(account.id, 'owner-1', {
      status: 'DISCONNECTED',
      encryptedAccessToken: '',
    });
  });

  it('does not allow disconnecting another owner’s account', async () => {
    vi.spyOn(SOCIAL_REPOSITORY, 'getAccountById').mockResolvedValue(account);
    const updateAccount = vi.spyOn(SOCIAL_REPOSITORY, 'updateAccount');

    await expect(
      SOCIAL_SERVICE.disconnectAccount('owner-2', account.id),
    ).rejects.toMatchObject({ code: 'SOCIAL_ACCOUNT_NOT_FOUND', statusCode: 404 });
    expect(updateAccount).not.toHaveBeenCalled();
  });

  it('selects an active Facebook Page owned by the requesting owner', async () => {
    const selectedPage = { ...account, id: 'account-2', isSelected: false };
    vi.spyOn(SOCIAL_REPOSITORY, 'getAccountById').mockResolvedValue(selectedPage);
    const selectFacebookAccount = vi
      .spyOn(SOCIAL_REPOSITORY, 'selectFacebookAccount')
      .mockResolvedValue();

    await expect(
      SOCIAL_SERVICE.selectFacebookAccount('owner-1', selectedPage.id),
    ).resolves.toMatchObject({
      id: selectedPage.id,
      platform: 'FACEBOOK_PAGE',
      isSelected: true,
    });
    expect(selectFacebookAccount).toHaveBeenCalledWith(selectedPage.id, 'owner-1');
  });

  it('publishes to only the selected Facebook Page', async () => {
    const selectedPage = {
      ...account,
      id: 'account-2',
      externalId: 'page-2',
      name: 'Dev Tester Page',
      isSelected: true,
    };
    vi.spyOn(SOCIAL_REPOSITORY, 'listAccounts').mockResolvedValue([
      account,
      selectedPage,
    ]);
    const createPost = vi.spyOn(SOCIAL_REPOSITORY, 'createPost').mockResolvedValue({
      id: 'post-1',
      clerkUserId: 'owner-1',
      accountIds: [selectedPage.id],
      imageUrl: 'https://example.test/flyer.png',
      mode: 'NOW',
      scheduledAt: '2026-10-20T00:00:00.000Z',
      status: 'PUBLISHING',
      createdAt: '2026-10-20T00:00:00.000Z',
      updatedAt: '2026-10-20T00:00:00.000Z',
    });

    await SOCIAL_SERVICE.enqueuePost({
      clerkUserId: 'owner-1',
      imageUrl: 'https://example.test/flyer.png',
      mode: 'NOW',
      scheduledAt: '2026-10-20T00:00:00.000Z',
    });

    expect(createPost).toHaveBeenCalledWith(
      expect.objectContaining({ accountIds: [selectedPage.id] }),
    );
  });
});

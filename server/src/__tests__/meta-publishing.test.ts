import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../integrations/meta/meta.client', () => ({
  metaGet: vi.fn(),
  metaPost: vi.fn(),
}));

import { metaGet, metaPost } from '../integrations/meta/meta.client';
import { publishInstagramFeedPhoto } from '../integrations/meta/meta.publishing';

const mockedMetaGet = vi.mocked(metaGet);
const mockedMetaPost = vi.mocked(metaPost);

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('publishInstagramFeedPhoto', () => {
  it('waits for the media container to finish processing before publishing', async () => {
    vi.useFakeTimers();
    mockedMetaPost
      .mockResolvedValueOnce({ id: 'container-123' })
      .mockResolvedValueOnce({ id: 'published-456' });
    mockedMetaGet
      .mockResolvedValueOnce({ status_code: 'IN_PROGRESS' })
      .mockResolvedValueOnce({ status_code: 'FINISHED' });

    const publishPromise = publishInstagramFeedPhoto({
      igUserId: 'instagram-user-1',
      accessToken: 'IG-access-token',
      imageUrl: 'https://images.example.test/flyer.jpg',
      caption: 'Flyer caption',
    });
    await vi.advanceTimersByTimeAsync(2_000);

    await expect(publishPromise).resolves.toBe('published-456');
    expect(mockedMetaGet).toHaveBeenCalledTimes(2);
    expect(mockedMetaGet).toHaveBeenCalledWith(
      '/container-123',
      { fields: 'status_code', access_token: 'IG-access-token' },
      'instagram',
    );
    expect(mockedMetaPost).toHaveBeenNthCalledWith(
      2,
      '/instagram-user-1/media_publish',
      {
        creation_id: 'container-123',
        access_token: 'IG-access-token',
      },
      'instagram',
    );
  });

  it('does not publish a container Meta reports as failed', async () => {
    mockedMetaPost.mockResolvedValueOnce({ id: 'container-123' });
    mockedMetaGet.mockResolvedValueOnce({
      status_code: 'ERROR',
      status: 'Media ID is not available',
    });

    await expect(
      publishInstagramFeedPhoto({
        igUserId: 'instagram-user-1',
        accessToken: 'IG-access-token',
        imageUrl: 'https://images.example.test/flyer.jpg',
      }),
    ).rejects.toThrow('Instagram media container cannot be published (ERROR');
    expect(mockedMetaPost).toHaveBeenCalledTimes(1);
  });
});

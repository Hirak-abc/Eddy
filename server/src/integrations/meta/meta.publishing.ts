import { metaGet, metaPost, type MetaGraphHost } from './meta.client';

const INSTAGRAM_CONTAINER_POLL_INTERVAL_MS = 2_000;
const INSTAGRAM_CONTAINER_MAX_ATTEMPTS = 15;

const instagramHostForToken = (accessToken: string): MetaGraphHost =>
  accessToken.startsWith('IG') ? 'instagram' : 'facebook';

interface FacebookPhotoResponse {
  id?: string;
  post_id?: string;
}

interface InstagramContainerResponse {
  id?: string;
}

interface InstagramPublishResponse {
  id?: string;
}

interface InstagramContainerStatus {
  status_code?: 'EXPIRED' | 'ERROR' | 'FINISHED' | 'IN_PROGRESS' | 'PUBLISHED';
  status?: string;
}

const waitForInstagramContainer = async (
  containerId: string,
  accessToken: string,
  host: MetaGraphHost,
): Promise<void> => {
  for (let attempt = 0; attempt < INSTAGRAM_CONTAINER_MAX_ATTEMPTS; attempt += 1) {
    const container = await metaGet<InstagramContainerStatus>(
      `/${containerId}`,
      { fields: 'status_code', access_token: accessToken },
      host,
    );

    if (container.status_code === 'FINISHED') return;
    if (
      container.status_code === 'ERROR' ||
      container.status_code === 'EXPIRED' ||
      container.status_code === 'PUBLISHED'
    ) {
      throw new Error(
        `Instagram media container cannot be published (${container.status_code}${
          container.status ? `: ${container.status}` : ''
        }).`,
      );
    }

    if (attempt < INSTAGRAM_CONTAINER_MAX_ATTEMPTS - 1) {
      await new Promise((resolve) =>
        setTimeout(resolve, INSTAGRAM_CONTAINER_POLL_INTERVAL_MS),
      );
    }
  }

  throw new Error(
    'Instagram media container is still processing after 30 seconds. Try publishing again.',
  );
};

export const publishFacebookPagePhoto = async (input: {
  pageId: string;
  accessToken: string;
  imageUrl: string;
  caption?: string;
}): Promise<string> => {
  const result = await metaPost<FacebookPhotoResponse>(
    `/${input.pageId}/photos`,
    {
      url: input.imageUrl,
      caption: input.caption,
      access_token: input.accessToken,
      published: 'true',
    },
  );
  const postId = result.post_id || result.id;
  if (!postId) {
    throw new Error('Facebook did not return a post id');
  }
  return postId;
};

export const publishInstagramFeedPhoto = async (input: {
  igUserId: string;
  accessToken: string;
  imageUrl: string;
  caption?: string;
}): Promise<string> => {
  const host = instagramHostForToken(input.accessToken);
  const container = await metaPost<InstagramContainerResponse>(
    `/${input.igUserId}/media`,
    {
      image_url: input.imageUrl,
      caption: input.caption,
      access_token: input.accessToken,
    },
    host,
  );
  if (!container.id) {
    throw new Error('Instagram did not return a media container id');
  }

  await waitForInstagramContainer(container.id, input.accessToken, host);

  const published = await metaPost<InstagramPublishResponse>(
    `/${input.igUserId}/media_publish`,
    {
      creation_id: container.id,
      access_token: input.accessToken,
    },
    host,
  );
  if (!published.id) {
    throw new Error('Instagram did not return a published media id');
  }
  return published.id;
};

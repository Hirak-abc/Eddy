import { metaPost } from './meta.client';

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
  const container = await metaPost<InstagramContainerResponse>(
    `/${input.igUserId}/media`,
    {
      image_url: input.imageUrl,
      caption: input.caption,
      access_token: input.accessToken,
    },
  );
  if (!container.id) {
    throw new Error('Instagram did not return a media container id');
  }

  const published = await metaPost<InstagramPublishResponse>(
    `/${input.igUserId}/media_publish`,
    {
      creation_id: container.id,
      access_token: input.accessToken,
    },
  );
  if (!published.id) {
    throw new Error('Instagram did not return a published media id');
  }
  return published.id;
};

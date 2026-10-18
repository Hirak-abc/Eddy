interface SocialFlyerInput {
  title?: string;
  content?: string;
  hashtags?: string[];
  selectedVersionId?: string;
  versions?: Array<{
    id?: string;
    caption?: string;
    hashtags?: string[];
  }>;
}

export const isPublicHttpsImage = (url?: string): url is string =>
  Boolean(url && /^https:\/\//i.test(url) && !url.startsWith('blob:'));

export const buildSocialCaption = (flyer: SocialFlyerInput): string => {
  const version =
    flyer.versions?.find((item) => item.id === flyer.selectedVersionId) ||
    flyer.versions?.[0];
  const caption =
    version?.caption || flyer.content || flyer.title || 'Posted with Eddy';
  const hashtags = (
    version?.hashtags?.length ? version.hashtags : flyer.hashtags || []
  ).join(' ');
  return [caption, hashtags].filter(Boolean).join('\n\n').slice(0, 2200);
};

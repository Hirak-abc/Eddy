import { api } from "./api";

export type FlyerLanguage = "HINDI" | "ENGLISH" | "HINGLISH";
export type FlyerStatus =
  | "QUEUED"
  | "GENERATING"
  | "READY"
  | "SCHEDULED"
  | "PUBLISHED"
  | "FAILED";

export interface Flyer {
  id: string;
  businessId: string;
  businessName: string;
  kind: "AUTOMATIC" | "CUSTOM";
  status: FlyerStatus;
  title: string;
  topic: string;
  language: FlyerLanguage;
  imageUrl?: string;
  caption?: string;
  hashtags: string[];
  couponDiscountPercent?: number;
  couponExpiresAt?: string;
  scheduledAt?: string;
  socialPostId?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export const flyerService = {
  list: () => api.get<{ flyers: Flyer[] }>("/flyers"),

  queueAutomatic: (body: {
    businessName: string;
    businessCategory: string;
    businessLocation: string;
    language: FlyerLanguage;
  }) => api.post<{ flyer: { id: string } }>("/flyers/automatic", body),

  uploadImage: (file: File) =>
    api.upload<{ image: { url: string } }>("/flyers/images", file),

  queueCustom: (body: {
    businessName: string;
    businessCategory: string;
    businessLocation: string;
    topic: string;
    language: FlyerLanguage;
    imageUrl: string;
  }) => api.post<{ flyer: { id: string } }>("/flyers/generate", body),

  schedule: (id: string, scheduledAt: string) =>
    api.post<{ post: { id: string; scheduledAt: string } }>(
      `/flyers/${id}/schedule`,
      { scheduledAt },
    ),

  publishNow: (id: string) =>
    api.post<{ post: { id: string; status: string } }>(
      `/flyers/${id}/publish`,
    ),
};

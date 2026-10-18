import { makeFunctionReference } from "convex/server";
import { config } from "../../config/env";
import { convexClient } from "../../integrations/convex/client";
import type { CreateFlyerInput, FlyerRecord } from "./flyer.types";

const listByOwner = makeFunctionReference<
  "query",
  { ownerClerkId: string; serverSecret: string },
  FlyerRecord[]
>("flyers:listByOwner");
const getById = makeFunctionReference<
  "query",
  { id: string; ownerClerkId: string; serverSecret: string },
  FlyerRecord | null
>("flyers:getById");
const createQueued = makeFunctionReference<
  "mutation",
  {
    ownerClerkId: string;
    businessId: string;
    businessName: string;
    businessCategory: string;
    businessLocation: string;
    kind: "AUTOMATIC" | "CUSTOM";
    title: string;
    topic: string;
    language: "HINDI" | "ENGLISH" | "HINGLISH";
    sourceImageUrl: string;
    serverSecret: string;
  },
  string
>("flyers:createQueued");
const claimQueued = makeFunctionReference<
  "mutation",
  { limit?: number; serverSecret: string },
  FlyerRecord[]
>("flyers:claimQueued");
const markGenerated = makeFunctionReference<
  "mutation",
  {
    id: string;
    title: string;
    topic: string;
    imageUrl: string;
    caption: string;
    hashtags: string[];
    couponCodeHash: string;
    couponDiscountPercent: number;
    couponExpiresAt: string;
    scheduledAt?: string;
    serverSecret: string;
  },
  string
>("flyers:markGenerated");
const markFailed = makeFunctionReference<
  "mutation",
  { id: string; errorMessage: string; serverSecret: string },
  null
>("flyers:markFailed");
const setPublicationError = makeFunctionReference<
  "mutation",
  {
    id: string;
    ownerClerkId: string;
    errorMessage: string;
    serverSecret: string;
  },
  null
>("flyers:setPublicationError");
const markScheduled = makeFunctionReference<
  "mutation",
  {
    id: string;
    ownerClerkId: string;
    scheduledAt: string;
    socialPostId: string;
    serverSecret: string;
  },
  null
>("flyers:markScheduled");
const rescheduleScheduledFlyer = makeFunctionReference<
  "mutation",
  { id: string; ownerClerkId: string; scheduledAt: string; serverSecret: string },
  { id: string; scheduledAt: string }
>("flyers:rescheduleScheduledFlyer");
const cancelScheduledFlyer = makeFunctionReference<
  "mutation",
  { id: string; ownerClerkId: string; serverSecret: string },
  null
>("flyers:cancelScheduledFlyer");
const markPublished = makeFunctionReference<
  "mutation",
  { id: string; ownerClerkId: string; serverSecret: string },
  null
>("flyers:markPublished");
const generateUploadUrl = makeFunctionReference<
  "mutation",
  Record<string, never>,
  string
>("businessImages:generateUploadUrl");
const getStorageUrl = makeFunctionReference<
  "query",
  { storageId: string },
  string | null
>("businessImages:getStorageUrl");
const storageIdSchema = (value: unknown): string | undefined => {
  if (
    typeof value === "object" &&
    value !== null &&
    "storageId" in value &&
    typeof value.storageId === "string"
  ) {
    return value.storageId;
  }
  return undefined;
};

const serverSecret = (): string => {
  if (!config.EDDY_CONVEX_SECRET) {
    const error = new Error("EDDY_CONVEX_SECRET is not configured.");
    Object.assign(error, {
      statusCode: 503,
      code: "CONVEX_SERVER_SECRET_NOT_CONFIGURED",
    });
    throw error;
  }
  return config.EDDY_CONVEX_SECRET;
};

const requireConvex = () => {
  if (!convexClient) {
    const error = new Error("Convex is not configured.");
    Object.assign(error, { statusCode: 503, code: "CONVEX_NOT_CONFIGURED" });
    throw error;
  }
  serverSecret();
  return convexClient;
};

export const FLYER_REPOSITORY = {
  listByOwner: async (ownerClerkId: string): Promise<FlyerRecord[]> =>
    requireConvex().query(listByOwner, { ownerClerkId, serverSecret: serverSecret() }),

  getById: async (
    id: string,
    ownerClerkId: string,
  ): Promise<FlyerRecord | null> =>
    requireConvex().query(getById, {
      id,
      ownerClerkId,
      serverSecret: serverSecret(),
    }),

  createQueued: async (input: CreateFlyerInput): Promise<string> =>
    String(
      await requireConvex().mutation(createQueued, {
        ...input,
        serverSecret: serverSecret(),
      }),
    ),

  claimQueued: async (limit = 5): Promise<FlyerRecord[]> =>
    requireConvex().mutation(claimQueued, { limit, serverSecret: serverSecret() }),

  markGenerated: async (input: {
    id: string;
    title: string;
    topic: string;
    imageUrl: string;
    caption: string;
    hashtags: string[];
    couponCodeHash: string;
    couponDiscountPercent: number;
    couponExpiresAt: string;
    scheduledAt?: string;
  }): Promise<void> => {
    await requireConvex().mutation(markGenerated, {
      ...input,
      serverSecret: serverSecret(),
    });
  },

  markFailed: async (id: string, errorMessage: string): Promise<void> => {
    await requireConvex().mutation(markFailed, {
      id,
      errorMessage,
      serverSecret: serverSecret(),
    });
  },

  setPublicationError: async (
    id: string,
    ownerClerkId: string,
    errorMessage: string,
  ): Promise<void> => {
    await requireConvex().mutation(setPublicationError, {
      id,
      ownerClerkId,
      errorMessage,
      serverSecret: serverSecret(),
    });
  },

  markScheduled: async (input: {
    id: string;
    ownerClerkId: string;
    scheduledAt: string;
    socialPostId: string;
  }): Promise<void> => {
    await requireConvex().mutation(markScheduled, {
      ...input,
      serverSecret: serverSecret(),
    });
  },

  rescheduleScheduled: async (input: {
    id: string;
    ownerClerkId: string;
    scheduledAt: string;
  }): Promise<{ id: string; scheduledAt: string }> =>
    requireConvex().mutation(rescheduleScheduledFlyer, {
      ...input,
      serverSecret: serverSecret(),
    }),

  cancelScheduled: async (
    id: string,
    ownerClerkId: string,
  ): Promise<void> => {
    await requireConvex().mutation(cancelScheduledFlyer, {
      id,
      ownerClerkId,
      serverSecret: serverSecret(),
    });
  },

  markPublished: async (id: string, ownerClerkId: string): Promise<void> => {
    await requireConvex().mutation(markPublished, {
      id,
      ownerClerkId,
      serverSecret: serverSecret(),
    });
  },

  uploadImage: async (bytes: Buffer, contentType: string): Promise<string> => {
    const client = requireConvex();
    const uploadUrl = await client.mutation(generateUploadUrl, {});
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body: bytes,
    });
    if (!uploadResponse.ok) {
      throw new Error(
        `Convex image upload failed with status ${uploadResponse.status}.`,
      );
    }
    const storageId = storageIdSchema(await uploadResponse.json());
    if (!storageId) throw new Error("Convex returned an invalid storage ID.");
    const imageUrl = await client.query(getStorageUrl, { storageId });
    if (!imageUrl) throw new Error("Convex did not return a public image URL.");
    return imageUrl;
  },
};

import { createHash, randomInt } from "crypto";
import sharp from "sharp";
import { FLYER_RULES } from "../../config/constants";
import { AppError } from "../../utils/errors";
import { XAI_FLYER_CLIENT } from "../../integrations/xai/xai.flyer";
import { BUSINESS_PROFILE_REPOSITORY } from "../business-profile/business-profile.repository";
import { SOCIAL_SERVICE } from "../social/social.service";
import { FLYER_REPOSITORY } from "./flyer.repository";
import type {
  CreateFlyerInput,
  FlyerLanguage,
  FlyerRecord,
} from "./flyer.types";

const couponAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const generateCouponCode = (): string =>
  Array.from(
    { length: 8 },
    () => couponAlphabet[randomInt(couponAlphabet.length)],
  ).join("");

export const selectCouponDiscount = (roll = randomInt(100)): number => {
  if (!Number.isInteger(roll) || roll < 0 || roll >= 100) {
    throw new RangeError("Coupon probability roll must be an integer from 0 to 99.");
  }
  if (roll < 50) return 3;
  if (roll < 95) return 5;
  return 10;
};

const couponHash = (code: string): string =>
  createHash("sha256").update(code).digest("hex");

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred.";

const errorContains = (error: unknown, code: string): boolean =>
  error instanceof Error && error.message.includes(code);

const requireBothSocialPlatforms = async (ownerClerkId: string): Promise<string[]> => {
  const accounts = await SOCIAL_SERVICE.listAccounts(ownerClerkId);
  const requiredPlatforms = ["FACEBOOK_PAGE", "INSTAGRAM"] as const;
  const selected = requiredPlatforms.map((platform) =>
    accounts.find(
      (account) =>
        account.platform === platform &&
        account.status === "ACTIVE",
    ),
  );
  if (selected.some((account) => !account)) {
    throw new AppError(
      "SOCIAL_ACCOUNT_NOT_READY",
      "Connect an active Facebook Page and Instagram account before publishing.",
      400,
    );
  }
  return selected.map((account) => account!.id);
};

const flyerCaption = (flyer: FlyerRecord): string =>
  [flyer.caption, flyer.hashtags.join(" ")].filter(Boolean).join("\n\n");

const mapCreateError = (error: unknown): never => {
  if (errorContains(error, "FLYER_GENERATION_COOLDOWN")) {
    throw new AppError(
      "FLYER_GENERATION_COOLDOWN",
      `You can generate at most ${FLYER_RULES.MAX_GENERATIONS_PER_COOLDOWN} flyer per ${FLYER_RULES.GENERATION_COOLDOWN_HOURS}-hour period.`,
      429,
    );
  }
  throw error;
};

const requireXaiConfigured = (): void => {
  if (!XAI_FLYER_CLIENT.isConfigured()) {
    throw new AppError(
      "XAI_NOT_CONFIGURED",
      "Flyer generation is unavailable until XAI_API_KEY is configured on the server.",
      503,
    );
  }
};

export const FLYER_SERVICE = {
  listByOwner: (ownerClerkId: string): Promise<FlyerRecord[]> =>
    FLYER_REPOSITORY.listByOwner(ownerClerkId),

  queueAutomatic: async (
    ownerClerkId: string,
    input: {
      businessName: string;
      businessCategory: string;
      businessLocation: string;
      language: FlyerLanguage;
    },
  ): Promise<{ id: string }> => {
    requireXaiConfigured();
    const images = await BUSINESS_PROFILE_REPOSITORY.listImages(ownerClerkId);
    const slots = ["shop", "product", "item"];
    const complete = slots.every((slot) =>
      images.some((image) => image.slot === slot),
    );
    if (!complete) {
      throw new AppError(
        "BUSINESS_IMAGES_INCOMPLETE",
        "Save all three business photos before generating the automatic flyer.",
        400,
      );
    }
    const image = images[randomInt(slots.length)];
    const createInput: CreateFlyerInput = {
      ownerClerkId,
      businessId: ownerClerkId,
      ...input,
      kind: "AUTOMATIC",
      title: "Trending India flyer",
      topic: "The latest trending meme in India",
      sourceImageUrl: image.url,
    };
    try {
      return { id: await FLYER_REPOSITORY.createQueued(createInput) };
    } catch (error) {
      return mapCreateError(error);
    }
  },

  queueCustom: async (
    ownerClerkId: string,
    input: {
      businessName: string;
      businessCategory: string;
      businessLocation: string;
      topic: string;
      language: FlyerLanguage;
      imageUrl: string;
    },
  ): Promise<{ id: string }> => {
    requireXaiConfigured();
    try {
      const id = await FLYER_REPOSITORY.createQueued({
        ownerClerkId,
        businessId: ownerClerkId,
        businessName: input.businessName,
        businessCategory: input.businessCategory,
        businessLocation: input.businessLocation,
        kind: "CUSTOM",
        title: input.topic,
        topic: input.topic,
        language: input.language,
        sourceImageUrl: input.imageUrl,
      });
      return { id };
    } catch (error) {
      return mapCreateError(error);
    }
  },

  uploadImage: async (bytes: Buffer): Promise<{ url: string }> => {
    if (bytes.length === 0 || bytes.length > 10 * 1024 * 1024) {
      throw new AppError("INVALID_IMAGE", "Image must be between 1 byte and 10 MB.", 400);
    }
    const metadata = await sharp(bytes).metadata();
    if (
      metadata.format !== "jpeg" &&
      metadata.format !== "png" &&
      metadata.format !== "webp"
    ) {
      throw new AppError(
        "INVALID_IMAGE",
        "Only valid JPEG, PNG, and WebP images are supported.",
        400,
      );
    }
    const contentType = {
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    }[metadata.format];
    if (!contentType) {
      throw new AppError("INVALID_IMAGE", "The image format is not supported.", 400);
    }
    return { url: await FLYER_REPOSITORY.uploadImage(bytes, contentType) };
  },

  processQueuedFlyers: async (): Promise<void> => {
    if (!XAI_FLYER_CLIENT.isConfigured()) return;
    const queued = await FLYER_REPOSITORY.claimQueued();
    for (const flyer of queued) {
      try {
        await FLYER_SERVICE.generateQueuedFlyer(flyer);
      } catch (error) {
        const message = errorMessage(error);
        console.error("Flyer generation failed", {
          flyerId: flyer.id,
          error: message,
        });
        await FLYER_REPOSITORY.markFailed(flyer.id, message);
      }
    }
  },

  generateQueuedFlyer: async (flyer: FlyerRecord): Promise<void> => {
    const couponDiscountPercent = selectCouponDiscount();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const couponCode = generateCouponCode();
      const generated = await XAI_FLYER_CLIENT.generate({
        kind: flyer.kind,
        topic: flyer.topic,
        language: flyer.language,
        businessName: flyer.businessName,
        businessCategory: flyer.businessCategory,
        businessLocation: flyer.businessLocation,
        sourceImageUrl: flyer.sourceImageUrl,
        couponCode,
        couponDiscountPercent,
      });
      const imageUrl = await FLYER_REPOSITORY.uploadImage(generated.image, "image/jpeg");
      const generatedAt = Date.now();
      const scheduledAt = new Date(
        generatedAt +
          FLYER_RULES.AUTO_PUBLISH_WINDOW_HOURS * 60 * 60 * 1000,
      ).toISOString();
      try {
        await FLYER_REPOSITORY.markGenerated({
          id: flyer.id,
          title: generated.title,
          topic: generated.topic,
          imageUrl,
          caption: generated.caption,
          hashtags: generated.hashtags,
          couponCodeHash: couponHash(couponCode),
          couponDiscountPercent,
          couponExpiresAt: new Date(
            generatedAt + FLYER_RULES.COUPON_VALIDITY_HOURS * 60 * 60 * 1000,
          ).toISOString(),
          scheduledAt,
        });
        if (scheduledAt) {
          await FLYER_SERVICE.scheduleGeneratedFlyer(
            flyer,
            imageUrl,
            generated.caption,
            generated.hashtags,
            scheduledAt,
          );
        }
        return;
      } catch (error) {
        if (!errorContains(error, "COUPON_CODE_COLLISION") || attempt === 2) {
          throw error;
        }
      }
    }
  },

  scheduleGeneratedFlyer: async (
    flyer: FlyerRecord,
    imageUrl: string,
    caption: string,
    hashtags: string[],
    scheduledAt: string,
  ): Promise<void> => {
    try {
      const accountIds = await requireBothSocialPlatforms(flyer.ownerClerkId);
      const post = await SOCIAL_SERVICE.schedulePost({
        clerkUserId: flyer.ownerClerkId,
        flyerId: flyer.id,
        imageUrl,
        caption: [caption, hashtags.join(" ")].filter(Boolean).join("\n\n"),
        accountIds,
        scheduledAt,
      });
      await FLYER_REPOSITORY.markScheduled({
        id: flyer.id,
        ownerClerkId: flyer.ownerClerkId,
        scheduledAt,
        socialPostId: post.id,
      });
    } catch (error) {
      const message = errorMessage(error);
      await FLYER_REPOSITORY.setPublicationError(
        flyer.id,
        flyer.ownerClerkId,
        message,
      );
      console.error("Flyer automatic scheduling failed", {
        flyerId: flyer.id,
        error: message,
      });
    }
  },

  scheduleCustom: async (
    ownerClerkId: string,
    flyerId: string,
    scheduledAt: string,
  ) => {
    const flyer = await FLYER_REPOSITORY.getById(flyerId, ownerClerkId);
    if (!flyer) {
      throw new AppError("FLYER_NOT_FOUND", "Flyer not found.", 404);
    }
    if (
      (flyer.status !== "READY" && flyer.status !== "SCHEDULED") ||
      !flyer.imageUrl
    ) {
      throw new AppError("FLYER_NOT_READY", "This flyer is not ready to schedule.", 409);
    }
    if (flyer.status === "SCHEDULED") {
      if (!flyer.socialPostId) {
        throw new AppError(
          "FLYER_NOT_RESCHEDULABLE",
          "This flyer no longer has a pending scheduled post.",
          409,
        );
      }
      try {
        return await FLYER_REPOSITORY.rescheduleScheduled({
          id: flyer.id,
          ownerClerkId,
          scheduledAt,
        });
      } catch (error) {
        if (errorContains(error, "FLYER_NOT_RESCHEDULABLE")) {
          throw new AppError(
            "FLYER_NOT_RESCHEDULABLE",
            "This flyer can no longer be rescheduled because publishing has started.",
            409,
          );
        }
        if (errorContains(error, "FLYER_SCHEDULE_TIME_INVALID")) {
          throw new AppError(
            "FLYER_SCHEDULE_TIME_INVALID",
            "Choose a future date and time.",
            400,
          );
        }
        throw error;
      }
    }
    const accountIds = await requireBothSocialPlatforms(ownerClerkId);
    const post = await SOCIAL_SERVICE.schedulePost({
      clerkUserId: ownerClerkId,
      flyerId: flyer.id,
      imageUrl: flyer.imageUrl,
      caption: flyerCaption(flyer),
      accountIds,
      scheduledAt,
    });
    await FLYER_REPOSITORY.markScheduled({
      id: flyer.id,
      ownerClerkId,
      scheduledAt,
      socialPostId: post.id,
    });
    return post;
  },

  publishCustomNow: async (ownerClerkId: string, flyerId: string) => {
    const flyer = await FLYER_REPOSITORY.getById(flyerId, ownerClerkId);
    if (!flyer) {
      throw new AppError("FLYER_NOT_FOUND", "Flyer not found.", 404);
    }
    if (
      flyer.kind !== "CUSTOM" ||
      (flyer.status !== "READY" && flyer.status !== "SCHEDULED") ||
      !flyer.imageUrl
    ) {
      throw new AppError("FLYER_NOT_READY", "This custom flyer is not ready to publish.", 409);
    }
    const accountIds = await requireBothSocialPlatforms(ownerClerkId);
    if (flyer.status === "SCHEDULED") {
      try {
        await FLYER_REPOSITORY.cancelScheduled(flyer.id, ownerClerkId);
      } catch (error) {
        if (errorContains(error, "FLYER_NOT_CANCELLABLE")) {
          throw new AppError(
            "FLYER_NOT_CANCELLABLE",
            "This flyer can no longer be posted now because its scheduled publishing has started.",
            409,
          );
        }
        throw error;
      }
    }
    return SOCIAL_SERVICE.createAndPublishNow({
      clerkUserId: ownerClerkId,
      flyerId: flyer.id,
      imageUrl: flyer.imageUrl,
      caption: flyerCaption(flyer),
      accountIds,
    });
  },
};

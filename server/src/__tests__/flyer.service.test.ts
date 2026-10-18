import { beforeEach, describe, expect, it, vi } from "vitest";
import { BUSINESS_PROFILE_REPOSITORY } from "../modules/business-profile/business-profile.repository";
import { XAI_FLYER_CLIENT } from "../integrations/xai/xai.flyer";
import { FLYER_REPOSITORY } from "../modules/flyer/flyer.repository";
import { SOCIAL_SERVICE } from "../modules/social/social.service";
import {
  FLYER_SERVICE,
  generateCouponCode,
  selectCouponDiscount,
} from "../modules/flyer/flyer.service";
import type { FlyerRecord } from "../modules/flyer/flyer.types";

describe("flyer generation rules", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(XAI_FLYER_CLIENT, "isConfigured").mockReturnValue(true);
  });

  it.each([
    [0, 3],
    [49, 3],
    [50, 5],
    [94, 5],
    [95, 10],
    [99, 10],
  ])("maps probability roll %i to a %i%% flyer coupon", (roll, discount) => {
    expect(selectCouponDiscount(roll)).toBe(discount);
  });

  it("creates an eight-character code without ambiguous characters", () => {
    const code = generateCouponCode();
    expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/);
  });

  it("randomly selects one of the three saved photos for an automatic flyer", async () => {
    const images = [
      { slot: "shop" as const, storageKey: "shop", url: "https://storage.test/shop.jpg", uploadedAt: "" },
      { slot: "product" as const, storageKey: "product", url: "https://storage.test/product.jpg", uploadedAt: "" },
      { slot: "item" as const, storageKey: "item", url: "https://storage.test/item.jpg", uploadedAt: "" },
    ];
    vi.spyOn(BUSINESS_PROFILE_REPOSITORY, "listImages").mockResolvedValue(images);
    const createQueued = vi
      .spyOn(FLYER_REPOSITORY, "createQueued")
      .mockResolvedValue("flyer-id");

    await expect(
      FLYER_SERVICE.queueAutomatic("owner-id", {
        businessName: "Shop",
        businessCategory: "Cafe",
        businessLocation: "Lucknow",
        language: "HINGLISH",
      }),
    ).resolves.toEqual({ id: "flyer-id" });

    const selectedImage = createQueued.mock.calls[0][0].sourceImageUrl;
    expect(images.map((image) => image.url)).toContain(selectedImage);
    expect(createQueued).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerClerkId: "owner-id",
        kind: "AUTOMATIC",
        language: "HINGLISH",
        sourceImageUrl: selectedImage,
      }),
    );
  });

  it("requires all three business photos before queueing an automatic flyer", async () => {
    vi.spyOn(BUSINESS_PROFILE_REPOSITORY, "listImages").mockResolvedValue([
      {
        slot: "shop",
        storageKey: "shop",
        url: "https://storage.test/shop.jpg",
        uploadedAt: "",
      },
    ]);
    const createQueued = vi.spyOn(FLYER_REPOSITORY, "createQueued");

    await expect(
      FLYER_SERVICE.queueAutomatic("owner-id", {
        businessName: "Shop",
        businessCategory: "Cafe",
        businessLocation: "Lucknow",
        language: "ENGLISH",
      }),
    ).rejects.toThrow("Save all three business photos");
    expect(createQueued).not.toHaveBeenCalled();
  });

  it("reports the shared 72-hour generation limit returned by Convex", async () => {
    vi.spyOn(FLYER_REPOSITORY, "createQueued").mockRejectedValue(
      new Error("FLYER_GENERATION_COOLDOWN"),
    );

    await expect(
      FLYER_SERVICE.queueCustom("owner-id", {
        businessName: "Shop",
        businessCategory: "Cafe",
        businessLocation: "Lucknow",
        topic: "Diwali",
        language: "HINDI",
        imageUrl: "https://storage.test/source.jpg",
      }),
    ).rejects.toThrow("at most 1 flyer per 72-hour period");
  });

  it("applies the same generation limit to automatic flyers", async () => {
    vi.spyOn(BUSINESS_PROFILE_REPOSITORY, "listImages").mockResolvedValue([
      { slot: "shop", storageKey: "shop", url: "https://storage.test/shop.jpg", uploadedAt: "" },
      { slot: "product", storageKey: "product", url: "https://storage.test/product.jpg", uploadedAt: "" },
      { slot: "item", storageKey: "item", url: "https://storage.test/item.jpg", uploadedAt: "" },
    ]);
    vi.spyOn(FLYER_REPOSITORY, "createQueued").mockRejectedValue(
      new Error("FLYER_GENERATION_COOLDOWN"),
    );

    await expect(
      FLYER_SERVICE.queueAutomatic("owner-id", {
        businessName: "Shop",
        businessCategory: "Cafe",
        businessLocation: "Lucknow",
        language: "HINGLISH",
      }),
    ).rejects.toMatchObject({ code: "FLYER_GENERATION_COOLDOWN", statusCode: 429 });
  });

  it.each(["AUTOMATIC", "CUSTOM"] as const)(
    "schedules a %s flyer for publishing 72 hours after generation",
    async (kind) => {
      const flyer: FlyerRecord = {
        id: "flyer-id",
        ownerClerkId: "owner-id",
        businessId: "business-id",
        businessName: "Shop",
        businessCategory: "Cafe",
        businessLocation: "Lucknow",
        kind,
        status: "GENERATING",
        title: "Flyer",
        topic: "Diwali",
        language: "HINGLISH",
        sourceImageUrl: "https://storage.test/source.jpg",
        hashtags: [],
        createdAt: new Date(0).toISOString(),
        updatedAt: new Date(0).toISOString(),
      };
      const generatedAt = 1_000_000;
      vi.spyOn(Date, "now").mockReturnValue(generatedAt);
      vi.spyOn(XAI_FLYER_CLIENT, "generate").mockResolvedValue({
        topic: "Diwali",
        title: "Festive flyer",
        caption: "Celebrate with us.",
        hashtags: ["#Diwali"],
        image: Buffer.from("image"),
      });
      vi.spyOn(FLYER_REPOSITORY, "uploadImage").mockResolvedValue(
        "https://storage.test/generated.jpg",
      );
      const markGenerated = vi
        .spyOn(FLYER_REPOSITORY, "markGenerated")
        .mockResolvedValue();
      const scheduleGeneratedFlyer = vi
        .spyOn(FLYER_SERVICE, "scheduleGeneratedFlyer")
        .mockResolvedValue();

      await FLYER_SERVICE.generateQueuedFlyer(flyer);

      const expectedScheduledAt = new Date(
        generatedAt + 72 * 60 * 60 * 1000,
      ).toISOString();
      expect(markGenerated).toHaveBeenCalledWith(
        expect.objectContaining({ scheduledAt: expectedScheduledAt }),
      );
      expect(scheduleGeneratedFlyer).toHaveBeenCalledWith(
        flyer,
        "https://storage.test/generated.jpg",
        "Celebrate with us.",
        ["#Diwali"],
        expectedScheduledAt,
      );
    },
  );

  it("lets the owner change the default time of a pending scheduled flyer", async () => {
    const flyer: FlyerRecord = {
      id: "flyer-id",
      ownerClerkId: "owner-id",
      businessId: "business-id",
      businessName: "Shop",
      businessCategory: "Cafe",
      businessLocation: "Lucknow",
      kind: "CUSTOM",
      status: "SCHEDULED",
      title: "Flyer",
      topic: "Diwali",
      language: "HINGLISH",
      sourceImageUrl: "https://storage.test/source.jpg",
      imageUrl: "https://storage.test/generated.jpg",
      hashtags: [],
      socialPostId: "post-id",
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    };
    const scheduledAt = "2026-10-25T12:00:00.000Z";
    vi.spyOn(FLYER_REPOSITORY, "getById").mockResolvedValue(flyer);
    const reschedule = vi
      .spyOn(FLYER_REPOSITORY, "rescheduleScheduled")
      .mockResolvedValue({ id: "post-id", scheduledAt });
    const listAccounts = vi.spyOn(SOCIAL_SERVICE, "listAccounts");

    await expect(
      FLYER_SERVICE.scheduleCustom("owner-id", "flyer-id", scheduledAt),
    ).resolves.toEqual({ id: "post-id", scheduledAt });
    expect(reschedule).toHaveBeenCalledWith({
      id: "flyer-id",
      ownerClerkId: "owner-id",
      scheduledAt,
    });
    expect(listAccounts).not.toHaveBeenCalled();
  });

  it("does not queue flyer jobs when the xAI key is missing", async () => {
    vi.spyOn(XAI_FLYER_CLIENT, "isConfigured").mockReturnValue(false);
    const createQueued = vi.spyOn(FLYER_REPOSITORY, "createQueued");

    await expect(
      FLYER_SERVICE.queueCustom("owner-id", {
        businessName: "Shop",
        businessCategory: "Cafe",
        businessLocation: "Lucknow",
        topic: "Diwali",
        language: "HINDI",
        imageUrl: "https://storage.test/source.jpg",
      }),
    ).rejects.toMatchObject({ code: "XAI_NOT_CONFIGURED", statusCode: 503 });
    expect(createQueued).not.toHaveBeenCalled();
  });
});

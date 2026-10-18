import sharp from "sharp";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../config/env", () => ({
  config: { XAI_API_KEY: "test-xai-key" },
}));

import { config } from "../config/env";
import { XAI_FLYER_CLIENT } from "../integrations/xai/xai.flyer";

const brief = {
  topic: "India cafe trend",
  title: "A fresh cup for today",
  caption: "Enjoy a fresh cup at your neighborhood cafe.",
  hashtags: ["#Cafe", "#India"],
  visualPrompt: `A cheerful original cafe scene inspired by a current trend. ${"Describe a detailed composition with warm festive colors, a clear focal point, and careful placement of the uploaded business photo. ".repeat(20)}`,
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("xAI flyer generation integration", () => {
  it("uses xAI web search and Imagine edits, then overlays the coupon code", async () => {
    const sourceImage = await sharp({
      create: {
        width: 320,
        height: 240,
        channels: 3,
        background: "#f0a030",
      },
    })
      .png()
      .toBuffer();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            output: [
              {
                type: "message",
                content: [{ type: "output_text", text: JSON.stringify(brief) }],
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [{ b64_json: sourceImage.toString("base64") }],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await XAI_FLYER_CLIENT.generate({
      kind: "AUTOMATIC",
      topic: "Latest Indian meme",
      language: "HINGLISH",
      businessName: "Local Cafe",
      businessCategory: "Cafe",
      businessLocation: "Lucknow",
      sourceImageUrl: "https://images.example.test/shop.jpg",
      couponCode: "ABCD2345",
      couponDiscountPercent: 5,
    });

    expect(result).toMatchObject({
      topic: brief.topic,
      title: brief.title,
      caption: brief.caption,
      hashtags: brief.hashtags,
    });
    expect(result.image).toBeInstanceOf(Buffer);
    expect((await sharp(result.image).metadata()).format).toBe("jpeg");
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [searchUrl, searchInit] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(searchUrl).toBe("https://api.x.ai/v1/responses");
    expect((searchInit.headers as Record<string, string>).Authorization).toBe(
      "Bearer test-xai-key",
    );
    expect(JSON.parse(String(searchInit.body))).toMatchObject({
      model: "grok-4.7",
      tools: [{ type: "web_search" }],
    });

    const [imageUrl, imageInit] = fetchMock.mock.calls[1] as [
      string,
      RequestInit,
    ];
    expect(imageUrl).toBe("https://api.x.ai/v1/images/edits");
    expect(JSON.parse(String(imageInit.body))).toMatchObject({
      model: "grok-imagine-image-2.0",
      prompt: expect.stringContaining(brief.visualPrompt.trim()),
      image: {
        url: "https://images.example.test/shop.jpg",
        type: "image_url",
      },
    });
  });

  it("fails explicitly when the xAI key is absent", async () => {
    const originalKey = config.XAI_API_KEY;
    config.XAI_API_KEY = undefined;
    try {
      expect(XAI_FLYER_CLIENT.isConfigured()).toBe(false);
      await expect(
        XAI_FLYER_CLIENT.generate({
          kind: "CUSTOM",
          topic: "Diwali",
          language: "HINDI",
          businessName: "Local Cafe",
          businessCategory: "Cafe",
          businessLocation: "Lucknow",
          sourceImageUrl: "https://images.example.test/shop.jpg",
          couponCode: "ABCD2345",
          couponDiscountPercent: 3,
        }),
      ).rejects.toMatchObject({ code: "XAI_NOT_CONFIGURED", statusCode: 503 });
    } finally {
      config.XAI_API_KEY = originalKey;
    }
  });
});

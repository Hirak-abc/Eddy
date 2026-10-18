import sharp from "sharp";
import { z } from "zod";
import { config } from "../../config/env";
import { AppError } from "../../utils/errors";
import type { FlyerKind, FlyerLanguage } from "../../modules/flyer/flyer.types";

const XAI_API_BASE = "https://api.x.ai/v1";
const textModel = "grok-4.7";
const imageModel = "grok-imagine-image-2.0";

const briefSchema = z.object({
  topic: z.string().min(1).max(120),
  title: z.string().min(1).max(100),
  caption: z.string().min(1).max(1800),
  hashtags: z.array(z.string().regex(/^#[\p{L}\p{N}_]+$/u)).max(12),
  visualPrompt: z.string().trim().min(1).max(4000),
});

export interface FlyerGenerationInput {
  kind: FlyerKind;
  topic: string;
  language: FlyerLanguage;
  businessName: string;
  businessCategory: string;
  businessLocation: string;
  sourceImageUrl: string;
  couponCode: string;
  couponDiscountPercent: number;
}

export interface GeneratedFlyerContent {
  topic: string;
  title: string;
  caption: string;
  hashtags: string[];
  image: Buffer;
}

const requireApiKey = (): string => {
  if (!config.XAI_API_KEY) {
    throw new AppError(
      "XAI_NOT_CONFIGURED",
      "Flyer generation is unavailable until XAI_API_KEY is configured on the server.",
      503,
    );
  }
  return config.XAI_API_KEY;
};

const requestXai = async <T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> => {
  const response = await fetch(`${XAI_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new AppError(
      "XAI_API_ERROR",
      `xAI returned HTTP ${response.status} while generating the flyer.`,
      502,
    );
  }
  return (await response.json()) as T;
};

const extractResponseText = (response: unknown): string => {
  if (typeof response !== "object" || response === null || !("output" in response)) {
    throw new AppError("XAI_INVALID_RESPONSE", "xAI returned an invalid trend response.", 502);
  }
  const output = (response as { output?: unknown }).output;
  if (!Array.isArray(output)) {
    throw new AppError("XAI_INVALID_RESPONSE", "xAI returned an invalid trend response.", 502);
  }
  const texts = output.flatMap((item) => {
    if (typeof item !== "object" || item === null || !("content" in item)) return [];
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) return [];
    return content.flatMap((part) =>
      typeof part === "object" &&
      part !== null &&
      "text" in part &&
      typeof (part as { text?: unknown }).text === "string"
        ? [(part as { text: string }).text]
        : [],
    );
  });
  if (texts.length === 0) {
    throw new AppError("XAI_INVALID_RESPONSE", "xAI returned no flyer copy.", 502);
  }
  return texts.join("\n").trim();
};

const parseBrief = (text: string) => {
  const json = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new AppError("XAI_INVALID_RESPONSE", "xAI returned malformed flyer copy.", 502);
  }
  const result = briefSchema.safeParse(parsed);
  if (!result.success) {
    const invalidFields = [
      ...new Set(result.error.issues.map((issue) => issue.path.join("."))),
    ];
    throw new AppError(
      "XAI_INVALID_RESPONSE",
      `xAI flyer copy did not match the required format${
        invalidFields.length ? ` (invalid fields: ${invalidFields.join(", ")})` : ""
      }.`,
      502,
    );
  }
  return result.data;
};

const generateBrief = async (input: FlyerGenerationInput) => {
  const prompt =
    input.kind === "AUTOMATIC"
      ? `Search the live web for a currently trending meme or social-media trend in India that is suitable for a small business advertisement. Pick one current, India-relevant trend and cite it in the topic field. Do not invent trend facts.`
      : `Search the live web for current, India-relevant information and meme references suitable for a small-business flyer about: "${input.topic}". Use this requested topic as the subject; do not replace it with an unrelated trend.`;
  const language = {
    HINDI: "Hindi written in Devanagari",
    ENGLISH: "English",
    HINGLISH: "natural Hinglish mixing Hindi and English",
  }[input.language];
  const response = await requestXai<unknown>("/responses", {
    model: textModel,
    input: [
      {
        role: "user",
        content: `${prompt}

Business: ${input.businessName}
Category: ${input.businessCategory}
Location: ${input.businessLocation}
Write the flyer caption in ${language}. Keep it suitable for a real Indian local business and avoid unverified discounts, addresses, or product claims. Create an original, meme-inspired visual direction rather than copying a copyrighted meme image or character. Return only one valid JSON object, with no markdown or surrounding text, and exactly these fields: topic (1-120 characters), title (1-100 characters), caption (1-1800 characters), hashtags (an array of at most 12 strings, each beginning with # and containing only letters, numbers, or underscores), and visualPrompt (1-4000 characters). visualPrompt should describe the original meme-inspired visual composition that will be combined with the uploaded business photo.`,
      },
    ],
    tools: [{ type: "web_search" }],
    max_output_tokens: 1800,
  });
  return parseBrief(extractResponseText(response));
};

const imageResponseSchema = z.object({
  data: z
    .array(
      z.object({
        url: z.string().url().optional(),
        b64_json: z.string().min(1).optional(),
      }),
    )
    .min(1),
});

const decodeImage = async (image: {
  url?: string;
  b64_json?: string;
}): Promise<Buffer> => {
  if (image.b64_json) return Buffer.from(image.b64_json, "base64");
  if (!image.url) {
    throw new AppError("XAI_INVALID_RESPONSE", "xAI returned no flyer image.", 502);
  }
  const response = await fetch(image.url);
  if (!response.ok) {
    throw new AppError("XAI_IMAGE_DOWNLOAD_FAILED", "Could not retrieve the generated flyer image.", 502);
  }
  const contentType = response.headers.get("content-type")?.split(";")[0];
  if (!contentType?.startsWith("image/")) {
    throw new AppError("XAI_INVALID_RESPONSE", "xAI returned a non-image flyer result.", 502);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length === 0 || bytes.length > 20 * 1024 * 1024) {
    throw new AppError("XAI_INVALID_RESPONSE", "xAI returned an invalid flyer image size.", 502);
  }
  return bytes;
};

const escapeXml = (value: string): string =>
  value.replace(/[<>&'"]/g, (char) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[char];
  });

const addCouponCode = async (
  image: Buffer,
  code: string,
  discountPercent: number,
): Promise<Buffer> => {
  const metadata = await sharp(image).metadata();
  if (!metadata.width || !metadata.height) {
    throw new AppError("XAI_INVALID_RESPONSE", "Could not read the generated flyer image.", 502);
  }
  const width = metadata.width;
  const height = metadata.height;
  const bandHeight = Math.max(112, Math.round(height * 0.19));
  const fontSize = Math.max(28, Math.round(width * 0.075));
  const letterSpacing = Math.max(3, Math.round(fontSize * 0.16));
  const codeText = escapeXml(code);
  const interference = Array.from({ length: 7 }, (_, index) => {
    const y = Math.round(bandHeight * (0.28 + (index % 4) * 0.15));
    const x1 = Math.round(width * (0.12 + index * 0.03));
    const x2 = Math.round(width * (0.62 + index * 0.035));
    const curve = Math.round((index % 2 ? 1 : -1) * bandHeight * 0.12);
    return `<path d="M${x1},${y} Q${Math.round((x1 + x2) / 2)},${y + curve} ${x2},${y + curve}" />`;
  }).join("");
  const overlay = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="${height - bandHeight}" width="${width}" height="${bandHeight}" fill="#111827" fill-opacity="0.86"/>
      <text x="${width / 2}" y="${height - bandHeight + 28}" text-anchor="middle" fill="#fde68a" font-family="Arial,sans-serif" font-size="${Math.max(14, Math.round(fontSize * 0.3))}" font-weight="700" letter-spacing="2">${discountPercent}% OFF · ONE-TIME FLYER CODE</text>
      <g fill="none" stroke="#f8fafc" stroke-opacity="0.34" stroke-width="2">${interference}</g>
      <text x="${width / 2}" y="${height - Math.round(bandHeight * 0.25)}" text-anchor="middle" fill="#fff" font-family="monospace" font-size="${fontSize}" font-weight="800" letter-spacing="${letterSpacing}" transform="rotate(-1 ${width / 2} ${height - Math.round(bandHeight * 0.25)})">${codeText}</text>
    </svg>`,
  );
  return sharp(image).composite([{ input: overlay }]).jpeg({ quality: 90 }).toBuffer();
};

export const XAI_FLYER_CLIENT = {
  isConfigured: (): boolean => Boolean(config.XAI_API_KEY),

  generate: async (input: FlyerGenerationInput): Promise<GeneratedFlyerContent> => {
    const brief = await generateBrief(input);
    const imageResponse = await requestXai<unknown>("/images/edits", {
      model: imageModel,
      prompt: `Edit the supplied business photo into a polished social-media advertisement for ${input.businessName}. Preserve the real product/store shown in the source photo. Incorporate this original meme-inspired visual direction based on the live Indian trend: ${brief.visualPrompt}. Use a clean, photorealistic Indian small-business campaign style. Do not generate any words, letters, numbers, coupon labels, or logos; a verified offer code will be added as an overlay separately.`,
      image: { url: input.sourceImageUrl, type: "image_url" },
    });
    const parsedImageResponse = imageResponseSchema.safeParse(imageResponse);
    if (!parsedImageResponse.success) {
      throw new AppError("XAI_INVALID_RESPONSE", "xAI returned an invalid flyer image response.", 502);
    }
    const sourceImage = await decodeImage(parsedImageResponse.data.data[0]);
    const image = await addCouponCode(
      sourceImage,
      input.couponCode,
      input.couponDiscountPercent,
    );
    return {
      topic: brief.topic,
      title: brief.title,
      caption: brief.caption,
      hashtags: brief.hashtags,
      image,
    };
  },
};

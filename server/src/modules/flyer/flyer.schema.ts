import { z } from "zod";

const languageSchema = z.enum(["HINDI", "ENGLISH", "HINGLISH"]);
const publicHttpsUrl = z
  .string()
  .url()
  .refine((value) => value.startsWith("https://"), {
    message: "Image URL must be public HTTPS so xAI and Meta can access it.",
  });

export const automaticFlyerBodySchema = z.object({
  businessName: z.string().trim().min(1).max(120),
  businessCategory: z.string().trim().min(1).max(100),
  businessLocation: z.string().trim().min(1).max(180),
  language: languageSchema,
});

export const customFlyerBodySchema = z.object({
  businessName: z.string().trim().min(1).max(120),
  businessCategory: z.string().trim().min(1).max(100),
  businessLocation: z.string().trim().min(1).max(180),
  topic: z.string().trim().min(2).max(160),
  language: languageSchema,
  imageUrl: publicHttpsUrl,
});

export const flyerIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const scheduleFlyerBodySchema = z.object({
  scheduledAt: z.string().datetime().refine(
    (value) => Date.parse(value) > Date.now(),
    { message: "Choose a future date and time." },
  ),
});

import { z } from 'zod';

export const patchMeSchema = z.object({
  displayName: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
}).strict();

export const signupRoleSchema = z.union([
  z.literal('OWNER'),
  z.literal('CUSTOMER'),
]).optional().describe('Signup role: OWNER or CUSTOMER only. ADMIN never creatable via public signup.');

export const getMeQuerySchema = z.object({
  role: z.union([z.literal('OWNER'), z.literal('CUSTOMER')]).optional(),
}).optional();

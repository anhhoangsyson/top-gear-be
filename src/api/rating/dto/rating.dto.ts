import { z } from 'zod';
import mongoose from 'mongoose';

// Create Rating DTO
export const createRatingSchema = z.object({
  orderId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Order ID không hợp lệ',
  }),
  laptopId: z
    .string()
    .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
      message: 'Laptop ID không hợp lệ',
    })
    .optional()
    .nullable(),
  rating: z.number().min(1).max(5, {
    message: 'Rating phải từ 1 đến 5 sao',
  }),
  comment: z
    .string()
    .max(1000, {
      message: 'Comment không được vượt quá 1000 ký tự',
    })
    .optional(),
});

export type CreateRatingDto = z.infer<typeof createRatingSchema>;

// Update Rating DTO
export const updateRatingSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().max(1000).optional(),
});

export type UpdateRatingDto = z.infer<typeof updateRatingSchema>;

// Query Rating DTO
export const queryRatingSchema = z.object({
  orderId: z.string().optional(),
  laptopId: z.string().optional(),
  userId: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 20)),
});

export type QueryRatingDto = z.infer<typeof queryRatingSchema>;

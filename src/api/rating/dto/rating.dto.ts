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
  status: z.enum(['visible', 'hidden']).optional(),
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

// Admin Reply DTO
export const adminReplySchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Nội dung reply không được để trống' })
    .max(2000, { message: 'Nội dung reply không được vượt quá 2000 ký tự' }),
});

export type AdminReplyDto = z.infer<typeof adminReplySchema>;

// Update Status DTO (Admin only)
export const updateStatusSchema = z.object({
  status: z.enum(['visible', 'hidden'], {
    errorMap: () => ({ message: 'Status phải là visible hoặc hidden' }),
  }),
});

export type UpdateStatusDto = z.infer<typeof updateStatusSchema>;

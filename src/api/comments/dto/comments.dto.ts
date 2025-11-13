import mongoose from 'mongoose';
import { z } from 'zod';

export interface IComments {
  name: string;
  content: string;
  images?: string[];
  blog_id: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId;
  parent_id?: mongoose.Schema.Types.ObjectId | null;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComments {
  name: string;
  content: string;
  images?: string[];
  blog_id: mongoose.Schema.Types.ObjectId;
  user_id?: mongoose.Schema.Types.ObjectId;
  parent_id?: mongoose.Schema.Types.ObjectId | null;
  isApproved?: boolean;
}

// Zod schemas
export const createCommentSchema = z.object({
  name: z.string().min(1, { message: 'Tên không được để trống' }).max(100),
  content: z
    .string()
    .min(1, { message: 'Nội dung không được để trống' })
    .max(2000),
  images: z.array(z.string().url()).optional(),
  blog_id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Blog ID không hợp lệ',
  }),
  parent_id: z
    .string()
    .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
      message: 'Parent ID không hợp lệ',
    })
    .optional()
    .nullable(),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  content: z.string().min(1).max(2000).optional(),
  images: z.array(z.string().url()).optional(),
  isApproved: z.boolean().optional(),
});

export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;

export const queryCommentSchema = z.object({
  blog_id: z.string().optional(),
  user_id: z.string().optional(),
  parent_id: z.string().optional(),
  isApproved: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 20)),
});

export type QueryCommentDto = z.infer<typeof queryCommentSchema>;

import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.enum(['order', 'comment', 'like', 'system', 'product', 'promotion']),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  data: z.any().optional(),
  link: z.string().optional(),
});

export const updateNotificationSchema = z.object({
  isRead: z.boolean().optional(),
});

export const getNotificationsQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  isRead: z.enum(['true', 'false']).optional(),
  type: z
    .enum(['order', 'comment', 'like', 'system', 'product', 'promotion'])
    .optional(),
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationDto = z.infer<typeof updateNotificationSchema>;
export type GetNotificationsQueryDto = z.infer<
  typeof getNotificationsQuerySchema
>;

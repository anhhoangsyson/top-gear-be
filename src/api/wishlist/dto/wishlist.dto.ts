import { z } from 'zod';

// Create Wishlist DTO
export const createWishlistSchema = z.object({
  laptopId: z.string().min(1, 'Laptop ID là bắt buộc'),
});

export type CreateWishlistDto = z.infer<typeof createWishlistSchema>;

// Query Wishlist DTO
export const queryWishlistSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
});

export type QueryWishlistDto = z.infer<typeof queryWishlistSchema>;

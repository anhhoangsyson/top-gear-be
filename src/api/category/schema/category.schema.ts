import { z } from 'zod';

export const createCategorySchema = z.object({
  categoryName: z
    .string()
    .min(2, 'Category name must be at least 2 characters'),
});

export const updateCategorySchema = z.object({
  categoryName: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .optional(),
  isDeleted: z.boolean().optional(),
});

export const categoryIdSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID format'),
});

export const addCategoryAttributeSchema = z.object({
  attributeId: z.string().uuid('Invalid attribute ID format'),
});

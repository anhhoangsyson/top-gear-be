import { z } from 'zod';

// DTO for validate request when upload images
export const CreateProductImageDto = z.object({
  productVariantId: z.string().min(1, 'Product Variant ID không được để trống'),
  imageUrl: z.string().url('Image URL phải là một đường link hợp lệ'),
});

// DTO for format from response to client
export const ProductImageResponseDto = z.object({
  id: z.string(),
  productVariantId: z.string(),
  imageUrl: z.string().url('Image URL phải là một đường link hợp lệ'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateProductImageDtoType = z.infer<typeof CreateProductImageDto>;
export type ProductImageResponseDtoType = z.infer<
  typeof ProductImageResponseDto
>;

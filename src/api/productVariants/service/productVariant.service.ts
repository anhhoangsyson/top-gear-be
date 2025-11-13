import { ProductVariantsRepository } from '../repository/productVariants.repository';
import {
  CreateProductVariantsDto,
  UpdateProductVariantsDto,
} from '../dto/productVariants.dto';
import connectRedis from '../../../config/redis/redis.config';

const redisClient = connectRedis();

// Cache duration constants
const CACHE_TTL = {
  AUTOCOMPLETE: 300, // 5 minutes
  SEARCH: 120, // 2 minutes
};

export const ProductVariantsService = {
  async getAllProductVariants({
    skip,
    limit,
  }: {
    skip: number;
    limit: number;
  }) {
    return await ProductVariantsRepository.getAllPrductVariants(skip, limit);
  },
  async getProductVariantsByChildId(childId: string) {
    return await ProductVariantsRepository.getProductVariantsByChildId(childId);
  },
  async createProductVariants(data: CreateProductVariantsDto) {
    return await ProductVariantsRepository.createProductVariants(data);
  },

  async findProductVariantById(id: string) {
    return await ProductVariantsRepository.getProductVariantsByCategory(id);
  },

  async getProductVariantsByCategory(categoryId: string) {
    return await ProductVariantsRepository.getProductVariantsByCategory(
      categoryId,
    );
  },

  async findByProductId(productId: string) {
    return await ProductVariantsRepository.findByProductId(productId);
  },

  async findProductVariantsByFilter(filterData: any) {
    return await ProductVariantsRepository.findProductVariantsByFilter(
      filterData,
    );
  },

  async updateProductVariantsById(
    productVariantsId: string,
    data: UpdateProductVariantsDto,
  ) {
    return await ProductVariantsRepository.updateProductVariantsById(
      productVariantsId,
      data,
    );
  },

  async inActiveProductVariantsById(productVariantsId: string) {
    return await ProductVariantsRepository.inActiveProductVariantsById(
      productVariantsId,
    );
  },

  async activeProductVariantsById(productVariantsId: string) {
    return await ProductVariantsRepository.activeProductVariantsById(
      productVariantsId,
    );
  },

  async getProductVariantsRelated(productId: string) {
    return await ProductVariantsRepository.getProductVariantsRelated(productId);
  },

  // Search products with pagination and filters
  async searchProducts(
    keyword: string,
    page: number = 1,
    limit: number = 20,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      categories?: string[];
      status?: string;
    },
  ) {
    // Validate keyword
    if (!keyword || keyword.trim().length === 0) {
      throw new Error('Search keyword is required');
    }

    // Create cache key
    const cacheKey = `search:${keyword}:${page}:${limit}:${JSON.stringify(filters || {})}`;

    try {
      // Check cache first
      const cachedResult = await redisClient.get(cacheKey);
      if (cachedResult) {
        return JSON.parse(cachedResult);
      }

      // Calculate skip
      const skip = (page - 1) * limit;

      // Perform search
      const { results, total } = await ProductVariantsRepository.searchVariants(
        keyword,
        skip,
        limit,
        filters,
      );

      // Calculate pagination info
      const totalPages = Math.ceil(total / limit);
      const response = {
        data: results,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: filters || {},
      };

      // Cache the result
      await redisClient.setex(
        cacheKey,
        CACHE_TTL.SEARCH,
        JSON.stringify(response),
      );

      return response;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Autocomplete for fast suggestions
  async autocompleteProducts(keyword: string, limit: number = 5) {
    // Validate keyword
    if (!keyword || keyword.trim().length < 2) {
      return { suggestions: [] };
    }

    // Create cache key
    const cacheKey = `autocomplete:${keyword.toLowerCase()}:${limit}`;

    try {
      // Check cache first
      const cachedResult = await redisClient.get(cacheKey);
      if (cachedResult) {
        return JSON.parse(cachedResult);
      }

      // Perform autocomplete search
      const suggestions = await ProductVariantsRepository.autocompleteVariants(
        keyword,
        limit,
      );

      const response = { suggestions };

      // Cache the result
      await redisClient.setex(
        cacheKey,
        CACHE_TTL.AUTOCOMPLETE,
        JSON.stringify(response),
      );

      return response;
    } catch (error) {
      console.error('Autocomplete error:', error);
      throw error;
    }
  },
};

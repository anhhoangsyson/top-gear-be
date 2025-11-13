import mongoose from 'mongoose';

export interface CreateProductVariantsDto {
  productId: mongoose.Types.ObjectId;
  variantName: string;
  variantPrice: number;
  variantPriceSale: number;
  filterCategories: string[];
  variantStock: number;
}

export interface UpdateProductVariantsDto {
  variantName: string;
  variantPrice?: number;
  variantStock?: number;
  status?: string;
}

export interface SearchProductsDto {
  q: string; // Search keyword
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  categories?: string[];
  status?: string;
}

export interface AutocompleteDto {
  q: string; // Search keyword
  limit?: number;
}

export interface SearchResultDto {
  _id: string;
  variantName: string;
  variantPrice: number;
  variantPriceSale: number;
  variantStock: number;
  filterCategories: string[];
  status: string;
  image?: string;
  score?: number;
}

export interface AutocompleteSuggestionDto {
  _id: string;
  variantName: string;
  variantPriceSale: number;
  image?: string;
}

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SearchResponseDto {
  success: boolean;
  message: string;
  data: SearchResultDto[];
  pagination: PaginationDto;
  filters?: any;
}

export interface AutocompleteResponseDto {
  success: boolean;
  message: string;
  suggestions: AutocompleteSuggestionDto[];
}

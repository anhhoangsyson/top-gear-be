import { ProductVariantsRepository } from '../repository/productVariants.repository';
import {
  CreateProductVariantsDto,
  UpdateProductVariantsDto,
} from '../dto/productVariants.dto';

export const ProductVariantsService = {
  async getAllProductVariants() {
    return await ProductVariantsRepository.getAllPrductVariants();
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
};

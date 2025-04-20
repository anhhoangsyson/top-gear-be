import { CreateProductImageDtoType } from '../dto/productImage.dto';
import { ProductImageRepository } from '../repository/productImage.repository';

export class ProductImageService {
  private productImageRepository = new ProductImageRepository();

  async createProductImage(data: any) {
    return await this.productImageRepository.createProductImage(data);
  }

  async getProductImageById(id: string) {
    return await this.productImageRepository.getProductImageById(id);
  }

  async getProductImageByProductVariantId(productVariantId: string) {
    return await this.productImageRepository.getProductImageByProductVariantId(
      productVariantId,
    );
  }

  async getFirstProductImageByProductVariantId(productVariantId: string) {
    return await this.productImageRepository.getFirstProductImageByProductVariantId(
      productVariantId,
    );
  }

  async deleteProductImageById(id: string) {
    return await this.productImageRepository.deleteProductImageById(id);
  }
}

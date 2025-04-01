import { CreateProductImageDtoType } from '../dto/productImage.dto';
import { ProductImage } from '../schema/productImage.schema';

export class ProductImageRepository {
  async createProductImage(data: CreateProductImageDtoType) {
    const productImage = new ProductImage(data);
    return await productImage.save();
  }

  async getProductImageById(id: string) {
    return await ProductImage.findById(id);
  }

  async getProductImageByProductVariantId(productVariantId: string) {
    return await ProductImage.find({ productVariantId });
  }

  async deleteProductImageById(id: string) {
    return await ProductImage.findByIdAndDelete(id);
  }
}

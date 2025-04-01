import { ProductAttributesRepository } from '../repository/productAttributes.repository';
import { CreateProductAttributes } from '../dto/productAttributes.dto';
import { IProductAttribute } from '../schema/productAttributes.schema';

export class ProductAttributeService {
  private r = new ProductAttributesRepository();

  async createProductAttributes(
    data: CreateProductAttributes,
  ): Promise<IProductAttribute> {
    return await this.r.createProductAttributes(data);
  }

  async getProductAttributesByVariantId(variantId: string) {
    return await this.r.getProductAttributesByVariantId(variantId);
  }

  async setActiveStatus(productAttributeId: string, isActive: boolean) {
    return await this.r.setActiveStatus(productAttributeId, isActive);
  }

  async updateProductAttributes(
    productAttributeId: string,
    data: CreateProductAttributes,
  ) {
    return await this.r.updateProductAttributes(productAttributeId, data);
  }
}

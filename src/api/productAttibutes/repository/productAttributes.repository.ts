import { StatusProductVariant } from '../../../constants/status/status.constant';
import {
  CreateProductAttributes,
  UpdateProductAttributes,
} from '../dto/productAttributes.dto';
import {
  IProductAttribute,
  ProductAttribute,
} from '../schema/productAttributes.schema';

export class ProductAttributesRepository {
  async createProductAttributes(
    data: CreateProductAttributes,
  ): Promise<IProductAttribute> {
    return await ProductAttribute.create(data);
  }

  async getProductAttributesByVariantId(
    variantId: string,
  ): Promise<IProductAttribute[]> {
    return await ProductAttribute.find({ variantId });
  }

  async setActiveStatus(
    productAttributeId: string,
    isActive: boolean,
  ): Promise<IProductAttribute | null> {
    return await ProductAttribute.findByIdAndUpdate(
      productAttributeId,
      {
        status: isActive
          ? StatusProductVariant.ACTIVE
          : StatusProductVariant.INACTIVE,
      },
      { new: true },
    );
  }

  async updateProductAttributes(
    productAttributeId: string,
    data: UpdateProductAttributes,
  ): Promise<IProductAttribute | null> {
    return await ProductAttribute.findByIdAndUpdate(productAttributeId, data, {
      new: true,
    });
  }
}

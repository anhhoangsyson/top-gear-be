import mongoose, { Schema } from 'mongoose';
import {
  IAttributeResponseDto,
  IAttributeDto,
  ICreateAttributeDto,
} from '../dto/attribute.dto';
import { Attribute, CategoryAttribute } from '../schema/attributeschema';

export class AttributeRepository {
  async getAllAttributes(): Promise<IAttributeResponseDto[]> {
    const attributes = await Attribute.find().lean();

    const result = await Promise.all(
      attributes.map(async (attribute) => {
        const categoryAttributes = await CategoryAttribute.find({
          attributeId: attribute._id,
        })
          .select('categoryId')
          .lean();
        return {
          ...attribute,
          categoryIds: categoryAttributes.map((ca) => ca.categoryId.toString()),
        };
      }),
    );
    return result;
  }

  async createAttribute(
    attributeData: ICreateAttributeDto,
  ): Promise<IAttributeDto> {
    const { attributeName, categoryIds } = attributeData;

    const attribute = new Attribute({ attributeName: attributeName });

    const savedAttribute = await attribute.save();

    if (categoryIds && categoryIds.length > 0) {
      const categoryAttributeRecords = categoryIds.map((categoryId) => ({
        attributeId: savedAttribute,
        categoryId: new mongoose.Types.ObjectId(categoryId),
      }));
      await CategoryAttribute.insertMany(categoryAttributeRecords);
    }
    return {
      _id: savedAttribute._id.toString(),
      attributeName: savedAttribute.attributeName,
      categoryIds: categoryIds || [],
    };
  }

  async getAttributeById(id: string): Promise<IAttributeDto | null> {
    return await Attribute.findById(id);
  }

  async deleteAttributeById(id: string): Promise<IAttributeDto | null> {
    return await Attribute.findByIdAndDelete(id);
  }

  async updateAttributeById(
    id: string,
    dataAttribute: IAttributeDto,
  ): Promise<IAttributeDto | null> {
    return await Attribute.findByIdAndUpdate(id, dataAttribute, { new: true });
  }

  async activeAttributeById(id: string) {
    return await Attribute.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true },
    );
  }

  async inActiveAttributeById(id: string) {
    return await Attribute.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
  }
}

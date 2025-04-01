import {
  IAttributeResponseDto,
  IAttributeDto,
  ICreateAttributeDto,
} from '../dto/attribute.dto';
import { Attribute } from '../schema/attributeschema';

export class AttributeRepository {
  async getAllAttributes(): Promise<IAttributeResponseDto[]> {
    return await Attribute.find();
  }

  async createAttribute(
    attributeData: ICreateAttributeDto,
  ): Promise<IAttributeDto> {
    const attribute = new Attribute(attributeData);
    return await attribute.save();
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
}

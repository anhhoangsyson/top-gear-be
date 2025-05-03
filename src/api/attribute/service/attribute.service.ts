import {
  IAttributeDto,
  ICreateAttributeDto,
  IAttributeResponseDto,
} from '../dto/attribute.dto';
import { AttributeRepository } from '../repository/attribute.repository';

export class AttributeService {
  private a = new AttributeRepository();

  async getAllAttributes(): Promise<IAttributeResponseDto[]> {
    return this.a.getAllAttributes();
  }

  async createAttriute(
    data: ICreateAttributeDto,
  ): Promise<IAttributeResponseDto> {
    return this.a.createAttribute(data);
  }

  async updateAttributeById(
    id: string,
    data: IAttributeDto,
  ): Promise<IAttributeResponseDto | null> {
    return this.a.updateAttributeById(id, data);
  }

  async getAttributeById(id: string): Promise<IAttributeResponseDto | null> {
    return this.a.getAttributeById(id);
  }

  // feature
  async inActiveAttributeById(id: string) {
    return this.a.inActiveAttributeById(id);
  }

  async activeAttributeById(id: string) {
    return this.a.activeAttributeById(id);
  }

  async getAttributesByCategoryId(categoryId: string) {
    return this.a.getAttributesByCategoryId(categoryId);
  }
}

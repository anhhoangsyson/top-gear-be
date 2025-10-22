import LaptopGroupModel, { ILaptopGroup } from '../schema/laptop-group.schema';

export class LaptopGroupRepository {
  async create(data: Partial<ILaptopGroup>) {
    return LaptopGroupModel.create(data);
  }

  async findAll() {
    return LaptopGroupModel.find().populate('laptops').sort({ sortOrder: 1 });
  }

  async findById(id: string) {
    return LaptopGroupModel.findById(id).populate('laptops');
  }

  async update(id: string, data: Partial<ILaptopGroup>) {
    return LaptopGroupModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return LaptopGroupModel.findByIdAndDelete(id);
  }
}

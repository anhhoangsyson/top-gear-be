import Brand from '../../brand/schema/brandSchema';
import Category from '../../category/schema/category.schema';
import Laptop, { ICreateLaptop, ILaptop } from '../schema/laptop.schema';

export class LaptopRepository {
  async createLaptop(laptopData: Partial<ICreateLaptop>): Promise<ILaptop> {
    const createLaptop = await new Laptop(laptopData).save();

    const populatedLaptop = await Laptop.findById(createLaptop._id)
      .populate('brandId', 'name logo')
      .populate('categoryId', 'name slug')
      .exec();
    if (!populatedLaptop) {
      throw new Error('Laptop not found after creation');
    }
    return populatedLaptop;
  }

  async findLaptopById(id: string): Promise<ILaptop | null> {
    return await Laptop.findById(id)
      .populate('brandId', 'name logo')
      .populate('categoryId', 'name slug')
      .exec();
  }

  async findAllLaptops(): Promise<ILaptop[]> {
    return await Laptop.find()
      .populate('brandId', 'name logo')
      .populate('categoryId', 'name slug')
      .exec();
  }

  async updateLaptop(
    id: string,
    laptopData: Partial<ILaptop>,
  ): Promise<ILaptop | null> {
    return await Laptop.findByIdAndUpdate(id, laptopData, { new: true }).exec();
  }

  async deleteLaptop(id: string): Promise<ILaptop | null> {
    return await Laptop.findByIdAndDelete(id).exec();
  }

  async findLaptopBySlug(slug: string): Promise<ILaptop | null> {
    return await Laptop.findOne({ slug: slug })
      .populate('brandId', 'name logo')
      .populate('categoryId', 'name slug')
      .exec();
  }

  async getLaptopRelated(
    brandId: string,
    categoryId: string,
    excludeId: string,
  ): Promise<ILaptop[]> {
    const filter: any = { brandId, categoryId };

    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    return await Laptop.find(filter)
      .populate('brandId', 'name logo')
      .populate('categoryId', 'name slug')
      .exec();
  }

  findLaptopsBysCategory = async (categorySLug: string, filters = {}) => {
    const category = await Category.findOne({ slug: categorySLug });
    if (!category) {
      throw new Error('Category not found');
    }

    return Laptop.find({ categoryId: category._id, ...filters })
      .populate('brandId', 'name logo')
      .populate('categoryId', 'name slug')
      .exec();
  };

  async findLaptopsByBrand(
    brandSlug: string,
    filters = {},
  ): Promise<ILaptop[]> {
    const brand = await Brand.findOne({ slug: brandSlug });
    if (!brand) {
      throw new Error('Brand not found');
    }

    return await Laptop.find({ brandId: brand._id, ...filters })
      .populate('brandId', 'name logo')
      .populate('categoryId', 'name slug')
      .exec();
  }

  async findLaptopsByCategoryAndBrand(
    categorySlug: string,
    brandSLug: string,
    filters = {},
  ): Promise<ILaptop[]> {
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      throw new Error('Category not found');
    }
    const brand = await Brand.findOne({ slug: brandSLug });
    if (!brand) {
      throw new Error('Brand not found');
    }

    return await Laptop.find({
      categoryId: category._id,
      brandId: brand._id,
      ...filters,
    })
      .populate('brandId', 'name logo')
      .populate('categoryId', 'name slug')
      .exec();
  }

  async filterLaptops(filter: any): Promise<ILaptop[]> {
    return await Laptop.find(filter)
      .populate('brandId', 'name logo')
      .populate('categoryId', 'name slug')
      .exec();
  }
}

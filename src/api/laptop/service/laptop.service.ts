import Brand from '../../brand/schema/brandSchema';
import Category from '../../category/schema/category.schema';
import { LaptopRepository } from '../repository/laptop.repository';
import { ICreateLaptop, ILaptop } from '../schema/laptop.schema';

export class LaptopService {
  constructor(private readonly laptopRepository: LaptopRepository) {}

  async createLaptop(laptopData: Partial<ICreateLaptop>): Promise<ILaptop> {
    return await this.laptopRepository.createLaptop(laptopData);
  }

  async getLaptopById(id: string): Promise<ILaptop | null> {
    return await this.laptopRepository.findLaptopById(id);
  }

  async getAllLaptops(): Promise<ILaptop[]> {
    return await this.laptopRepository.findAllLaptops();
  }

  async updateLaptop(
    id: string,
    laptopData: Partial<ILaptop>,
  ): Promise<ILaptop | null> {
    const existingLaptop = await this.laptopRepository.findLaptopById(id);
    if (!existingLaptop) {
      throw new Error('Laptop not found');
    }

    return await this.laptopRepository.updateLaptop(id, laptopData);
  }

  async deleteLaptop(id: string): Promise<ILaptop | null> {
    return await this.laptopRepository.deleteLaptop(id);
  }

  async getLaptopBySlug(slug: string): Promise<ILaptop | null> {
    return await this.laptopRepository.findLaptopBySlug(slug);
  }

  async getLaptopRelated(
    brandId: string,
    categoryId: string,
    excludeId: string,
  ): Promise<ILaptop[]> {
    return await this.laptopRepository.getLaptopRelated(
      brandId,
      categoryId,
      excludeId,
    );
  }

  async findLaptopsByBrand(brandSlug: string, filters: {}): Promise<ILaptop[]> {
    return await this.laptopRepository.findLaptopsByBrand(brandSlug, filters);
  }

  async findLaptopsByCategory(
    categorySlug: string,
    filters: {},
  ): Promise<ILaptop[]> {
    return await this.laptopRepository.findLaptopsBysCategory(
      categorySlug,
      filters,
    );
  }

  async findLaptopsByCategoryAndBrand(
    categorySlug: string,
    brandSlug: string,
    filters: {},
  ): Promise<ILaptop[]> {
    return await this.laptopRepository.findLaptopsByCategoryAndBrand(
      categorySlug,
      brandSlug,
      filters,
    );
  }

  async filterLaptops(query: any): Promise<ILaptop[]> {
    const filter = {} as any;

    if (query.ram) {
      const ramArr = query.ram.split(',');
      filter['specifications.ram'] = { $in: ramArr.map(Number) };
    }

    if (query.cpu) {
      const cpuArr = query.cpu.split(',');
      // Tạo mảng điều kiện regex, không phân biệt hoa thường
      filter['specifications.processor'] = {
        $in: cpuArr.map((cpu: string) => new RegExp(cpu, 'i')),
      };
    }

    // Giá (nhiều khoảng)
    if (query.minPrice && query.maxPrice) {
      const minPrices = Array.isArray(query.minPrice)
        ? query.minPrice
        : [query.minPrice];
      const maxPrices = Array.isArray(query.maxPrice)
        ? query.maxPrice
        : [query.maxPrice];
      const priceConditions = minPrices.map((min: number, idx: number) => ({
        price: { $gte: Number(min), $lte: Number(maxPrices[idx]) },
      }));
      filter.$or = priceConditions;
    }

    // Brand
    if (query.brand) {
      const brandSlugs = query.brand.split(',');
      const brands = await Brand.find({ slug: { $in: brandSlugs } });
      const brandIds = brands.map((b) => b._id);
      filter.brandId = { $in: brandIds };
    }

    // Category
    if (query.category) {
      const categorySlugs = query.category.split(',');
      const categories = await Category.find({ slug: { $in: categorySlugs } });
      const categoryIds = categories.map((c) => c._id);
      filter.categoryId = { $in: categoryIds };
    }

    return await this.laptopRepository.filterLaptops(filter);
  }

  async setActiveStatus(id: string, isActive: boolean) {
    return await this.laptopRepository.updateLaptop(id, { isActive });
  }
}

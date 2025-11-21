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

  // Search suggestions - trả về danh sách gợi ý tìm kiếm (chỉ tên laptop và một số thông tin cơ bản)
  async searchSuggestions(query: string, limit: number = 10): Promise<any[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchResults = await Laptop.find(
      {
        $and: [
          { isActive: true },
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { modelName: { $regex: query, $options: 'i' } },
              { tags: { $regex: query, $options: 'i' } },
              { 'specifications.processor': { $regex: query, $options: 'i' } },
            ],
          },
        ],
      },
      {
        name: 1,
        modelName: 1,
        slug: 1,
        price: 1,
        discountPrice: 1,
        'images.imageUrl': 1,
        'images.isPrimary': 1,
        brandId: 1,
      },
    )
      .populate('brandId', 'name logo')
      .limit(limit)
      .lean()
      .exec();

    return searchResults.map((laptop: any) => ({
      id: laptop._id,
      name: laptop.name,
      modelName: laptop.modelName,
      slug: laptop.slug,
      price: laptop.price,
      discountPrice: laptop.discountPrice,
      primaryImage:
        laptop.images?.find((img: any) => img.isPrimary)?.imageUrl ||
        laptop.images?.[0]?.imageUrl,
      brand: laptop.brandId,
    }));
  }

  // Autocomplete - trả về danh sách các từ khóa để autocomplete
  async autocomplete(query: string, limit: number = 10): Promise<string[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    // Tìm các laptop match với query
    const results = await Laptop.find(
      {
        $and: [
          { isActive: true },
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { modelName: { $regex: query, $options: 'i' } },
              { tags: { $regex: query, $options: 'i' } },
              { 'specifications.processor': { $regex: query, $options: 'i' } },
            ],
          },
        ],
      },
      {
        name: 1,
        modelName: 1,
        tags: 1,
        'specifications.processor': 1,
      },
    )
      .limit(limit * 2) // Lấy nhiều hơn để có đủ unique terms
      .lean()
      .exec();

    // Tạo set các từ khóa unique
    const suggestions = new Set<string>();

    results.forEach((laptop: any) => {
      // Thêm tên laptop
      if (
        laptop.name &&
        laptop.name.toLowerCase().includes(query.toLowerCase())
      ) {
        suggestions.add(laptop.name);
      }
      // Thêm model name
      if (
        laptop.modelName &&
        laptop.modelName.toLowerCase().includes(query.toLowerCase())
      ) {
        suggestions.add(laptop.modelName);
      }
      // Thêm processor
      if (
        laptop.specifications?.processor &&
        laptop.specifications.processor
          .toLowerCase()
          .includes(query.toLowerCase())
      ) {
        suggestions.add(laptop.specifications.processor);
      }
      // Thêm tags
      if (laptop.tags) {
        laptop.tags.forEach((tag: string) => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(tag);
          }
        });
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }

  // Realtime search - trả về danh sách laptop chi tiết với phân trang
  async realtimeSearch(
    query: string,
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'relevance',
  ): Promise<{
    laptops: ILaptop[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (!query || query.trim().length === 0) {
      return {
        laptops: [],
        total: 0,
        page,
        totalPages: 0,
      };
    }

    const skip = (page - 1) * limit;

    // Build search filter
    const searchFilter: any = {
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { modelName: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } },
            { 'specifications.processor': { $regex: query, $options: 'i' } },
            { 'specifications.graphicsCard': { $regex: query, $options: 'i' } },
          ],
        },
      ],
    };

    // Build sort option
    let sortOption: any = {};
    switch (sortBy) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { 'ratings.average': -1, 'ratings.count': -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      default: // relevance - sắp xếp theo createdAt mới nhất nếu không có text search
        sortOption = { createdAt: -1 };
    }

    // Count total results
    const total = await Laptop.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    // Get laptops with pagination
    const laptopsResult: any = await Laptop.find(searchFilter)
      .populate('brandId', 'name logo')
      .populate('categoryId', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      laptops: laptopsResult,
      total,
      page,
      totalPages,
    };
  }
}

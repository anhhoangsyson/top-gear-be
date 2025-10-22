import Category, { ICategory } from '../schema/category.schema';
// import { findTopLevelCategory } from '../../../lib/category';

export class CategoryRepository {
  constructor(private readonly categoryModel: typeof Category) {}

  async create(data: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(data);
    return await category.save();
  }

  async findById(id: string): Promise<ICategory | null> {
    return await Category.findById(id).exec();
  }

  async findAll(): Promise<ICategory[]> {
    return await Category.find().exec();
  }

  async findTopLevelCategory(): Promise<ICategory[]> {
    return await Category.find({ parentId: null }).exec();
  }

  async findSubCategor(parentId: string): Promise<ICategory[]> {
    return await Category.find({ parentId }).exec();
  }

  async findBySlub(id: string): Promise<ICategory | null> {
    return Category.findOne({ slug: id }).exec();
  }

  async findAllActiveCategory(): Promise<ICategory[] | null> {
    return await Category.find({ isActive: true }).exec();
  }

  async findAllSortedCategory(): Promise<ICategory[]> {
    return await Category.find().sort({ sortOrder: 1 }).exec();
  }

  async findCategoryWithSubCategories(
    parentId: string,
  ): Promise<{ parent: ICategory | null; subCategories: ICategory[] }> {
    const parent = await Category.findById(parentId).exec();
    const subCategories = await Category.find({ parentId }).exec();
    return { parent, subCategories };
  }

  async update(
    id: string,
    data: Partial<ICategory>,
  ): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async inActiveCategory(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    ).exec();
  }

  async activeCategory(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true },
    ).exec();
  }

  async updateSortOrder(
    id: string,
    sortOrder: number,
  ): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(
      id,
      { sortOrder },
      { new: true },
    ).exec();
  }

  async hadSubCategory(id: string): Promise<boolean> {
    const count = await Category.countDocuments({ parentId: id }).exec();
    return count > 0;
  }
}

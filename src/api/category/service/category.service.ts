import { ICreateCategoryDto } from '../dto/category.dto';
import { CategoryRepository } from '../repository/category.repository';
import { ICategory } from '../schema/category.schema';

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(categoryData: ICreateCategoryDto): Promise<ICategory> {
    return await this.categoryRepository.create(categoryData);
  }

  async findCategoryById(id: string): Promise<ICategory | null> {
    return await this.categoryRepository.findById(id);
  }

  async findAllCategories(): Promise<ICategory[]> {
    return await this.categoryRepository.findAll();
  }

  async findTopLevelCategories(): Promise<ICategory[]> {
    return await this.categoryRepository.findTopLevelCategory();
  }

  async findSubCategories(parentId: string): Promise<ICategory[]> {
    return await this.categoryRepository.findSubCategor(parentId);
  }

  async findCategoryBySlug(slug: string): Promise<ICategory | null> {
    return await this.categoryRepository.findBySlub(slug);
  }

  async findAllActiveCategories(): Promise<ICategory[] | null> {
    return await this.categoryRepository.findAllActiveCategory();
  }

  async findAllSortedCategories(): Promise<ICategory[]> {
    return await this.categoryRepository.findAllSortedCategory();
  }

  async findCategoryWithSubCategories(
    parentId: string,
  ): Promise<{ parent: ICategory | null; subCategories: ICategory[] }> {
    return await this.categoryRepository.findCategoryWithSubCategories(
      parentId,
    );
  }

  async updateCategory(
    id: string,
    data: Partial<ICategory>,
  ): Promise<ICategory | null> {
    return await this.categoryRepository.update(id, data);
  }

  async inactivateCategory(id: string): Promise<ICategory | null> {
    return await this.categoryRepository.inActiveCategory(id);
  }

  async activateCategory(id: string): Promise<ICategory | null> {
    return await this.categoryRepository.activeCategory(id);
  }

  async updateCategorySortOrder(
    id: string,
    sortOrder: number,
  ): Promise<ICategory | null> {
    return await this.categoryRepository.updateSortOrder(id, sortOrder);
  }

  async hasSubCategories(id: string): Promise<boolean> {
    return await this.categoryRepository.hadSubCategory(id);
  }
}

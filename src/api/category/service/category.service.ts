import { CategoryRepository } from '../repository/category.repository';
import type {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryAttributeDto,
  AddCategoryAttributeDto,
} from '../dto/category.dto';

export class CategoryService {
  private repository: CategoryRepository;

  constructor() {
    this.repository = new CategoryRepository();
  }

  async getAllCategories(): Promise<CategoryDto[]> {
    return this.repository.findAll();
  }

  async getCategoryById(categoryId: string): Promise<CategoryDto> {
    const category = await this.repository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async createCategory(data: CreateCategoryDto): Promise<CategoryDto> {
    return this.repository.create(data.categoryName);
  }

  async updateCategory(
    categoryId: string,
    data: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const category = await this.repository.update(categoryId, data);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const success = await this.repository.delete(categoryId);
    if (!success) {
      throw new Error('Category not found');
    }
  }

  async getCategoryAttributes(
    categoryId: string,
  ): Promise<CategoryAttributeDto[]> {
    // Verify category exists
    await this.getCategoryById(categoryId);
    return this.repository.getCategoryAttributes(categoryId);
  }

  async addCategoryAttribute(
    categoryId: string,
    data: AddCategoryAttributeDto,
  ): Promise<CategoryAttributeDto> {
    // Verify category exists
    await this.getCategoryById(categoryId);
    return this.repository.addCategoryAttribute(categoryId, data.attributeId);
  }

  async removeCategoryAttribute(
    categoryId: string,
    attributeId: string,
  ): Promise<void> {
    const success = await this.repository.removeCategoryAttribute(
      categoryId,
      attributeId,
    );
    if (!success) {
      throw new Error('Category attribute not found');
    }
  }
}

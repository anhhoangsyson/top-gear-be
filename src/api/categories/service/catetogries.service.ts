import {
  IAddCategoriesAttribute,
  ICategoriesAttribute,
  ICategories,
  ICreateCategories,
} from '../dto/categories.dto';
import { CategoriesRepository } from '../repository/categories.repository';

export class CategoriesService {
  private c = new CategoriesRepository();

  async getAllCategories(): Promise<ICategories[]> {
    return this.c.getAllCategories();
  }

  async getCategoriesTree() {
    return this.c.getCategoriesTree();
  }

  async getCategoriesByParentId(parentId: string) {
    return this.c.getCategoriesByParentId(parentId);
  }
  async getCategoriesByChildId(childId: string) {
    return this.c.getCategoriesByChildId(childId);
  }
  async getAllParentCategories() {
    return this.c.getAllParentCategories();
  }

  async createCategories(
    data: Partial<ICreateCategories>,
  ): Promise<ICreateCategories> {
    return await this.c.createCategories(data);
  }

  async getCategoriesById(id: string): Promise<ICategories | null> {
    const categories = await this.c.getCategoriesById(id);
    if (!categories) {
      throw new Error('Categories not found');
    }
    return categories;
  }

  async deleteCategoriesById(id: string): Promise<ICategories | null> {
    const categories = await this.c.deleteCategoriesById(id);
    if (!categories) {
      throw new Error('Categories not found');
    }
    return categories;
  }

  async updateCategoriesById(
    id: string,
    dataCategories: ICategories,
  ): Promise<ICategories | null> {
    const categories = await this.c.updateCategoriesById(id, dataCategories);
    if (!categories) {
      throw new Error('Categories not found');
    }
    return categories;
  }

  // categoriesAttiubute

  async addAttributeToCategories(
    userData: Partial<IAddCategoriesAttribute>,
  ): Promise<ICategoriesAttribute> {
    return await this.c.addAttribute(userData);
  }

  async getCategoriesAttributeById(categoryId: string) {
    return await this.c.getAttributeById(categoryId);
  }
}

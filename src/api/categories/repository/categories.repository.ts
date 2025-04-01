import {
  findTopLevelCategory,
  getCategoryWithChildren,
} from '../../../lib/category';
import {
  ICategories,
  ICreateCategories,
  IAddCategoriesAttribute,
  ICategoriesAttribute,
} from '../dto/categories.dto';
import { Categories, CategoriesAtribute } from '../schema/categories.schema';

export class CategoriesRepository {
  // Here for categories
  async getAllCategories(): Promise<ICategories[]> {
    return await Categories.find();
  }

  async getCategoriesTree() {
    const categoryMap = new Map();

    const categories = await Categories.find();

    categories.forEach((cat) => {
      categoryMap.set(cat._id.toString(), {
        categoryName: cat.categoryName,
        _id: cat._id,
        parentCategoryId: cat.parentCategoryId,
        children: [],
      });
    });

    let rootCategories: any[] = [];

    categories.forEach((cat) => {
      if (cat.parentCategoryId) {
        const parent = categoryMap.get(cat.parentCategoryId.toString());
        if (parent) {
          parent.children.push(categoryMap.get(cat._id.toString()));
        }
      } else {
        rootCategories.push(categoryMap.get(cat._id.toString() as string)); // Đây là các danh mục cha cấp cao nhất
      }
    });
    return rootCategories;
  }
  async getCategoriesByParentId(parentId: string) {
    const categoryMap = new Map();

    const categories = await Categories.find();

    categories.forEach((cat) => {
      categoryMap.set(cat._id.toString(), {
        categoryName: cat.categoryName,
        _id: cat._id,
        parentCategoryId: cat.parentCategoryId,
        children: [],
      });
    });

    let rootCategories: any[] = [];

    categories.forEach((cat) => {
      if (
        cat.parentCategoryId &&
        cat.parentCategoryId.toString() === parentId
      ) {
        rootCategories.push(categoryMap.get(cat._id.toString()));
      } else if (cat.parentCategoryId) {
        const parent = categoryMap.get(cat.parentCategoryId.toString());
        if (parent) {
          parent.children.push(categoryMap.get(cat._id.toString()));
        }
      }
    });

    return rootCategories;
  }

  async getCategoriesByChildId(childId: string) {
    const categories = await Categories.find();
    const categoryMap = new Map(
      categories.map((cat) => [cat._id.toString(), cat]),
    );
    const topLevelCategory = await findTopLevelCategory(categoryMap, childId);

    if (!topLevelCategory) {
      return [];
    }

    return await this.getCategoriesByParentId(topLevelCategory._id.toString());
  }

  async getAllParentCategories() {
    return await Categories.find({ parentCategoryId: null });
  }

  async createCategories(
    categoryData: Partial<ICreateCategories>,
  ): Promise<ICreateCategories> {
    const category = new Categories(categoryData);
    return await category.save();
  }

  async getCategoriesById(id: string): Promise<ICategories | null> {
    return await Categories.findById(id);
  }

  async deleteCategoriesById(id: string): Promise<ICategories | null> {
    return await Categories.findById(id);
  }

  async updateCategoriesById(
    id: string,
    dataCategories: ICategories,
  ): Promise<ICategories | null> {
    return await Categories.findByIdAndUpdate(id, dataCategories, {
      new: true,
    });
  }

  // Here for the CategoriesAttribute

  async addAttribute(
    iAddCategoriesAttribute: Partial<IAddCategoriesAttribute>,
  ): Promise<ICategoriesAttribute> {
    const categoriesAttribute = new CategoriesAtribute(iAddCategoriesAttribute);
    return await categoriesAttribute.save();
  }

  async getAttributeById(categoriesId: string) {
    return await CategoriesAtribute.find({ categoriesId }).populate(
      'attributeId',
    );
  }
}

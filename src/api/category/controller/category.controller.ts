import type { Request, Response } from 'express';
import { CategoryService } from '../service/category.service';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
  addCategoryAttributeSchema,
} from '../schema/category.schema';

export class CategoryController {
  private service: CategoryService;

  constructor() {
    this.service = new CategoryService();
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await this.service.getAllCategories();
      return res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCategoryById(req: Request, res: Response) {
    try {
      const { categoryId } = categoryIdSchema.parse(req.params);
      const category = await this.service.getCategoryById(categoryId);
      return res.status(200).json({ success: true, data: category });
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const data = createCategorySchema.parse(req.body);
      const category = await this.service.createCategory(data);
      return res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const { categoryId } = categoryIdSchema.parse(req.params);
      const data = updateCategorySchema.parse(req.body);
      const category = await this.service.updateCategory(categoryId, data);
      return res.status(200).json({ success: true, data: category });
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const { categoryId } = categoryIdSchema.parse(req.params);
      await this.service.deleteCategory(categoryId);
      return res
        .status(200)
        .json({ success: true, message: 'Category deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCategoryAttributes(req: Request, res: Response) {
    try {
      const { categoryId } = categoryIdSchema.parse(req.params);
      const attributes = await this.service.getCategoryAttributes(categoryId);
      return res.status(200).json({ success: true, data: attributes });
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async addCategoryAttribute(req: Request, res: Response) {
    try {
      const { categoryId } = categoryIdSchema.parse(req.params);
      const data = addCategoryAttributeSchema.parse(req.body);
      const attribute = await this.service.addCategoryAttribute(
        categoryId,
        data,
      );
      return res.status(201).json({ success: true, data: attribute });
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async removeCategoryAttribute(req: Request, res: Response) {
    try {
      const { categoryId, attributeId } = req.params;
      await this.service.removeCategoryAttribute(categoryId, attributeId);
      return res
        .status(200)
        .json({
          success: true,
          message: 'Category attribute removed successfully',
        });
    } catch (error: any) {
      if (error.message === 'Category attribute not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

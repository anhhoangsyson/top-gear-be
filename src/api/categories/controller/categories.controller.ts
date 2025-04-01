import { Request, Response } from 'express';
import { CategoriesService } from '../service/catetogries.service';
import {
  ICategoriesAttribute,
  IAddCategoriesAttribute,
} from '../dto/categories.dto';
import { addCategoryAttributeSchema } from '../../category/schema/category.schema';

const categoriesService = new CategoriesService();

export class CategoriesController {
  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await categoriesService.getAllCategories();
      res.status(200).json({
        data: categories,
        length: categories.length,
        message: 'Lấy tất cả danh mục thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async getCategoriesTree(req: Request, res: Response) {
    try {
      const categories = await categoriesService.getCategoriesTree();
      res.status(200).json({
        data: categories,
        message: 'Lấy cây danh mục thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async getCategoriesByParentId(req: Request, res: Response) {
    try {
      const parentId = req.params.parentId;
      const categories =
        await categoriesService.getCategoriesByParentId(parentId);
      res.status(200).json({
        data: categories,
        message: 'Lấy danh mục theo parentId thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async getAllParentCategories(req: Request, res: Response) {
    try {
      const categories = await categoriesService.getAllParentCategories();
      res.status(200).json({
        data: categories,
        message: 'Lấy tất cả danh mục cha thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  }
  async getCategoriesByChildId(req: Request, res: Response) {
    try {
      const categories = await categoriesService.getCategoriesByChildId(
        req.params.childId,
      );
      res.status(200).json({
        data: categories,
        message: 'Lấy danh mục theo childId thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  }
  async createCategories(req: Request, res: Response) {
    try {
      const body = req.body;

      const parentCategoryId = body.parentCategory;

      if (parentCategoryId) {
        const parentCategory =
          await categoriesService.getCategoriesById(parentCategoryId);
        if (!parentCategory) {
          return res
            .status(400)
            .json({ message: 'Danh mục cha không tồn tại' });
        } else {
          body.isFilter = true;
        }
      }

      const newCategory = await categoriesService.createCategories({
        categoryName: body.categoryName,
        parentCategoryId: body.parentCategory,
        isFilter: body.isFilter,
        isDeleted: false,
      });
      res.status(201).json({
        data: newCategory,
        message: 'Tạo danh mục thành công',
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }

  async getCategoriesById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const categories = await categoriesService.getCategoriesById(id);
      res.status(200).json({
        data: categories,
        message: 'Lấy danh mục theo ID thành công',
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async deleteCategoriesById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const categories = await categoriesService.deleteCategoriesById(id);
      res.status(200).json({
        data: categories,
        message: 'Xóa danh mục thành công',
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Lỗi máy chủ nội bộ' });
    }
  }

  async updateCategoriesById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const dataCategories = req.body;
      const categories = await categoriesService.updateCategoriesById(
        id,
        dataCategories,
      );
      res.status(200).json({
        data: categories,
        message: 'Cập nhật danh mục thành công',
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Lỗi máy chủ nội bộ' });
    }
  }

  async addAttributeToCategories(req: Request, res: Response): Promise<void> {
    try {
      const iCategoriesAttribute: IAddCategoriesAttribute = {
        categoriesId: req.params.id,
        attributeId: req.body.attributeId,
        attributeName: req.body.attributeName,
      };
      const categoriesAttribute =
        await categoriesService.addAttributeToCategories(iCategoriesAttribute);
      res.status(201).json({ categoriesAttribute });
    } catch (error) {
      res.status(400).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }

  async getCategoriesAttributeById(req: Request, res: Response): Promise<void> {
    try {
      const attribute = await categoriesService.getCategoriesAttributeById(
        req.params.id,
      );
      res.status(200).json({ attribute });
    } catch (error) {
      res.status(400).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }
}

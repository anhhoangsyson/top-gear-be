import { NextFunction, Request, Response } from 'express';
import { CategoryService } from '../service/category.service';
import { ICategory } from '../schema/category.schema';
import { ICreateCategoryDto, IUpdateCategoryDto } from '../dto/category.dto';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  // private categoryService = new CategoryService();

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'Vui lòng  tải lên hình ảnh' });
      }

      const { name, description, parentId, sortOrder, isActive } = req.body;
      const imageUrl = req.file?.path;
      console.log('imageUrl', imageUrl);

      const categoryData: ICreateCategoryDto = {
        name: name as string,
        description,
        parentId: parentId || null,
        sortOrder: sortOrder || 0,
        isActive: isActive || true,
        image: imageUrl,
      };

      const category = await this.categoryService.createCategory(categoryData);

      res.status(201).json({
        data: category,
        message: 'Tao category thanh cong',
      });
      return category;
    } catch (error) {
      next(error);
    }
  }

  async findCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await this.categoryService.findCategoryById(id);
      res.status(200).json({
        data: category,
        message: 'Lấy category thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async findAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.categoryService.findAllCategories();
      res.status(200).json({
        data: categories,
        length: categories.length,
        message: 'Lấy tất cả category thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async findTopLevelCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const categories = await this.categoryService.findTopLevelCategories();
      res.status(200).json({
        data: categories,
        message: 'Lấy danh mục cấp cao nhất thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async findSubCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { parentId } = req.params;
      const subCategories =
        await this.categoryService.findSubCategories(parentId);
      res.status(200).json({
        data: subCategories,
        message: 'Lấy danh mục con thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async findCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const category = await this.categoryService.findCategoryBySlug(slug);
      res.status(200).json({
        data: category,
        message: 'Lấy danh mục theo slug thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async findAllActiveCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const categories = await this.categoryService.findAllActiveCategories();
      res.status(200).json({
        data: categories,
        message: 'Lấy tất cả danh mục hoạt động thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async findAllSortedCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const categories = await this.categoryService.findAllSortedCategories();
      res.status(200).json({
        data: categories,
        message: 'Lấy tất cả danh mục đã sắp xếp thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async findCategoryWithSubCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { parentId } = req.params;
      const { parent, subCategories } =
        await this.categoryService.findCategoryWithSubCategories(parentId);
      res.status(200).json({
        data: { parent, subCategories },
        message: 'Lấy danh mục với danh mục con thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const image = req.file?.path;

      const { name, description, parentId, sortOrder, isActive } = req.body;

      const categoryData: IUpdateCategoryDto = {
        name: name as string,
        description: description,
        parentId: parentId || null,
        sortOrder: sortOrder || 0,
        isActive: isActive,
        image: image || req.body.image,
      };

      const updatedCategory = await this.categoryService.updateCategory(
        id,
        categoryData,
      );
      res.status(200).json({
        data: updatedCategory,
        message: 'Cập nhật danh mục thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async inactivateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const inactivatedCategory =
        await this.categoryService.inactivateCategory(id);
      res.status(200).json({
        data: inactivatedCategory,
        message: 'Vô hiệu hóa danh mục thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async activateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const activatedCategory = await this.categoryService.activateCategory(id);
      res.status(200).json({
        data: activatedCategory,
        message: 'Kích hoạt danh mục thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategorySortOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const { sortOrder } = req.body;
      const updatedCategory =
        await this.categoryService.updateCategorySortOrder(id, sortOrder);
      res.status(200).json({
        data: updatedCategory,
        message: 'Cập nhật thứ tự danh mục thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async hasSubCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const hasSubCategories = await this.categoryService.hasSubCategories(id);
      res.status(200).json({
        data: hasSubCategories,
        message: 'Kiểm tra danh mục có danh mục con thành công',
      });
    } catch (error) {
      next(error);
    }
  }
}

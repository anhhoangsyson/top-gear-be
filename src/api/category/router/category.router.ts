import { Router } from 'express';
import { CategoryController } from '../controller/category.controller';
import { CategoryRepository } from '../repository/category.repository';
import Category from '../schema/category.schema';
import { CategoryService } from '../service/category.service';
import upload, { uploadSingleImage } from '../../../middlewares/upload/upload';

const categoryRouter = Router();

// Khởi tạo các lớp
const categoryRepository = new CategoryRepository(Category);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

// Định nghĩa các route
categoryRouter.post('/', uploadSingleImage, (req, res, next) => {
  categoryController.createCategory(req, res, next);
});

categoryRouter.get('/', (req, res, next) =>
  categoryController.findAllCategories(req, res, next),
);
categoryRouter.get('/top-level', (req, res, next) =>
  categoryController.findTopLevelCategories(req, res, next),
);
categoryRouter.get('/sub-categories/:parentId', (req, res, next) =>
  categoryController.findSubCategories(req, res, next),
);
categoryRouter.get('/slug/:slug', (req, res, next) =>
  categoryController.findCategoryBySlug(req, res, next),
);
categoryRouter.get('/active', (req, res, next) =>
  categoryController.findAllActiveCategories(req, res, next),
);
categoryRouter.get('/sorted', (req, res, next) =>
  categoryController.findAllSortedCategories(req, res, next),
);
categoryRouter.get('/with-sub-categories/:parentId', (req, res, next) =>
  categoryController.findCategoryWithSubCategories(req, res, next),
);
categoryRouter.put('/:id', uploadSingleImage, (req, res, next) =>
  categoryController.updateCategory(req, res, next),
);
categoryRouter.patch('/:id/inactivate', (req, res, next) =>
  categoryController.inactivateCategory(req, res, next),
);
categoryRouter.patch('/:id/activate', (req, res, next) =>
  categoryController.activateCategory(req, res, next),
);
categoryRouter.patch('/:id/sort-order', (req, res, next) =>
  categoryController.updateCategorySortOrder(req, res, next),
);
categoryRouter.get('/:id/has-sub-categories', (req, res, next) =>
  categoryController.hasSubCategories(req, res, next),
);
categoryRouter.get('/:id', (req, res, next) =>
  categoryController.findCategoryById(req, res, next),
);

export default categoryRouter;

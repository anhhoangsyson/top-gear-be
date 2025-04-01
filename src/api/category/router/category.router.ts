import { Router } from 'express';
import { CategoryController } from '../controller/category.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { authorize } from '@/middlewares/authorize.middleware';

const router = Router();
const controller = new CategoryController();

// Public routes
router.get('/', controller.getAllCategories.bind(controller));
router.get('/:categoryId', controller.getCategoryById.bind(controller));
router.get(
  '/:categoryId/attributes',
  controller.getCategoryAttributes.bind(controller),
);

// Protected routes - require authentication and authorization
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  controller.createCategory.bind(controller),
);
router.put(
  '/:categoryId',
  authenticate,
  authorize(['admin']),
  controller.updateCategory.bind(controller),
);
router.delete(
  '/:categoryId',
  authenticate,
  authorize(['admin']),
  controller.deleteCategory.bind(controller),
);
router.post(
  '/:categoryId/attributes',
  authenticate,
  authorize(['admin']),
  controller.addCategoryAttribute.bind(controller),
);
router.delete(
  '/:categoryId/attributes/:attributeId',
  authenticate,
  authorize(['admin']),
  controller.removeCategoryAttribute.bind(controller),
);

export default router;

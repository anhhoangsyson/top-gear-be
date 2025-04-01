import { Router } from 'express';
import { CategoriesController } from '../controller/categories.controller';

const categoriesRouter = Router();
const categoriesController = new CategoriesController();

categoriesRouter.get('/', (req, res) => {
  categoriesController.getAllCategories(req, res);
});
categoriesRouter.get('/tree', (req, res) => {
  categoriesController.getCategoriesTree(req, res);
});

categoriesRouter.get('/parent/:parentId', (req, res) => {
  categoriesController.getCategoriesByParentId(req, res);
});

categoriesRouter.get('/parent', (req, res) => {
  categoriesController.getAllParentCategories(req, res);
});

categoriesRouter.get('/categoriesByChildId/:childId', (req, res) => {
  categoriesController.getCategoriesByChildId(req, res);
});

categoriesRouter.post('/', (req, res) => {
  categoriesController.createCategories(req, res);
});

categoriesRouter.get('/:id', (req, res) => {
  categoriesController.getCategoriesById(req, res);
});

categoriesRouter.delete('/:id', (req, res) => {
  categoriesController.deleteCategoriesById(req, res); // Đã sửa từ getMenusById thành deleteCategoriesById
});

categoriesRouter.patch('/:id', (req, res) => {
  categoriesController.updateCategoriesById(req, res); // Đã sửa từ updataMenusById thành updateCategoriesById
});

categoriesRouter.post('/attribute', (req, res) => {
  categoriesController.addAttributeToCategories(req, res);
});

export default categoriesRouter;

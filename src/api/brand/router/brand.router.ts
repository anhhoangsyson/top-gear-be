import { Router } from 'express';
import { BrandController } from '../controller/brand.controller';
import upload, { uploadSingleLogo } from '../../../middlewares/upload/upload';

const brandRouter = Router();
const brandController = new BrandController();

// @desc   Tạo thương hiệu mới
// @route  POST /api/v1/brand
// @access Private/Admin
brandRouter.post('/', uploadSingleLogo, (req, res, next) => {
  brandController.createBrand(req, res, next);
});

// @desc   Tạo thương hiệu mới
// @route  GET /api/v1/brand
// @access Public
brandRouter.get('/', (req, res, next) => {
  brandController.getAllBrands(req, res, next);
});

// @desc   lay cac thuong hieu dang hoat dong
// @route  POST /api/v1/brand/activenp
// @access Private/Admin
brandRouter.get('/active', (req, res, next) => {
  brandController.getAllBrandIsActive(req, res, next);
});

// @desc   lay thuong hieu theo id
// @route  POST /api/v1/brand/:id
// @access Public
brandRouter.get('/:id', (req, res, next) => {
  brandController.getBrandById(req, res, next);
});

// @desc   update thuong hieu theo id
// @route  POST /api/v1/brand/:id
// @access Private/Admin
brandRouter.patch('/:id', (req, res, next) => {
  brandController.updateBrandById(req, res, next);
});

// @desc   inactive thuong hieu theo id
// @route  POST /api/v1/brand/inactive/:id
// @access Private/Admin
brandRouter.patch('/inactive/:id', (req, res, next) => {
  brandController.inActiveBrand(req, res, next);
});

// @desc   active thuong hieu theo id
// @route  POST /api/v1/brand/:id
// @access Private/Admin
brandRouter.patch('/active/:id', (req, res, next) => {
  brandController.activeBrand(req, res, next);
});

export default brandRouter;

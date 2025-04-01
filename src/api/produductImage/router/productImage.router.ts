import { Router } from 'express';
import { ProductImageController } from '../controller/productImage.controller';
import upload from '../../../middlewares/upload/upload';
const productImageRouter = Router();
const productImageController = new ProductImageController();

productImageRouter.post('/', upload.single('imageUrl'), (req, res) => {
  productImageController.createProductImage(req, res);
});

productImageRouter.delete('/:imgId', (req, res) => {
  productImageController.deleteProductImage(req, res);
});

export default productImageRouter;

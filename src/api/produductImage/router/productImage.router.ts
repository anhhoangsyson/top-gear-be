import { Router } from 'express';
import { ProductImageController } from '../controller/productImage.controller';
import upload, { uploadSingle } from '../../../middlewares/upload/upload';
const productImageRouter = Router();
const productImageController = new ProductImageController();

productImageRouter.post('/', uploadSingle, (req, res) => {
  productImageController.createProductImage(req, res);
});

productImageRouter.delete('/:imgId', (req, res) => {
  productImageController.deleteProductImage(req, res);
});

productImageRouter.get('/:productVariantId', (req, res) => {
  productImageController.getFirstProductImageByProductVariantId(req, res);
});
export default productImageRouter;

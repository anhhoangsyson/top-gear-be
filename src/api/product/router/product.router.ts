import { Router } from 'express';
import { ProductController } from '../controller/product.controller';

const productRouter = Router();
const productController = new ProductController();

productRouter.get('/', (req, res) => {
  productController.getAllProducts(req, res);
});

productRouter.post('/', (req, res) => {
  productController.createProduct(req, res);
});

productRouter.get('/:id', (req, res) => {
  productController.getProductById(req, res);
});

productRouter.put('/:id', (req, res) => {
  productController.updateProductById(req, res);
});

export default productRouter;

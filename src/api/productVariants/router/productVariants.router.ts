import { Router } from 'express';
import { ProductVariantController } from '../controller/productVariant.controller';

const productVariantsRouter = Router();

productVariantsRouter.get('/', (req, res) => {
  ProductVariantController.getAllProductVariants(req, res);
});
productVariantsRouter.get('/pvariantsByChildId/:childId', (req, res) => {
  ProductVariantController.getProductVariantsByChildId(req, res);
});

productVariantsRouter.get('/filter', (req, res) => {
  ProductVariantController.findProductVariantsByFilter(req, res);
});

productVariantsRouter.get('/:id', (req, res) => {
  ProductVariantController.findProductVariantById(req, res);
});

productVariantsRouter.post('/', (req, res) => {
  ProductVariantController.createProductVariants(req, res);
});

productVariantsRouter.get('/findByProductId/:productId', (req, res) => {
  ProductVariantController.findByProductId(req, res);
});

productVariantsRouter.put('/:id', (req, res) => {
  ProductVariantController.updateProductVariantsById(req, res);
});

// productVariantsRouter.get('/c/:id', (req, res) => {
//     ProductVariantController.getProductVariantsByCategory(req, res);
// });

productVariantsRouter.put('/active/:productVariantsId', (req, res) => {
  ProductVariantController.activeProductVariantsById(req, res);
});

productVariantsRouter.put('/inactive/:productVariantsId', (req, res) => {
  ProductVariantController.inActiveProductVariantsById(req, res);
});

export default productVariantsRouter;

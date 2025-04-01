import { ProductAttributeController } from '../controller/productAttributes.controller';
import { Router } from 'express';

const productAttributesRouter = Router();
const productAttributesController = new ProductAttributeController();

productAttributesRouter.post('/', (req, res) => {
  productAttributesController.createProductAttributes(req, res);
});

productAttributesRouter.get('/:variantId', (req, res) => {
  productAttributesController.getProductAttributesByVariantId(req, res);
});

productAttributesRouter.patch('/:productAttributeId', (req, res) => {
  productAttributesController.setActiveStatus(req, res);
});
productAttributesRouter.put('/:productAttributeId', (req, res) => {
  productAttributesController.updateProductAttributes(req, res);
});

export default productAttributesRouter;

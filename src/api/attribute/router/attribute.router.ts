import { Router } from 'express';
import { AttributeController } from '../controller//attribute.controller';

const attributeRouter = Router();
const attributeController = new AttributeController();

attributeRouter.get('/', (req, res) => {
  attributeController.getAllAttributes(req, res);
});

attributeRouter.post('/', (req, res) => {
  attributeController.createAttribute(req, res);
});

attributeRouter.get('/:id', (req, res) => {
  attributeController.getAttributeById(req, res);
});

attributeRouter.put('/:id', (req, res) => {
  attributeController.updateAttributeById(req, res);
});

export default attributeRouter;

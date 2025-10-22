import { Router } from 'express';
import { LaptopGroupController } from '../controller/laptop-group.controller';
import { uploadSingBgImage } from '../../../middlewares/upload/upload';
// import upload nếu bạn muốn hỗ trợ upload ảnh background

const laptopGroupRouter = Router();

const laptopGroupController = new LaptopGroupController();

laptopGroupRouter.post('/', uploadSingBgImage, (req, res, next) => {
  laptopGroupController.create(req, res, next);
});

laptopGroupRouter.get('/:id', (req, res, next) => {
  laptopGroupController.getById(req, res, next);
});

laptopGroupRouter.get('/', (req, res, next) => {
  laptopGroupController.getAll(req, res, next);
});

laptopGroupRouter.put('/:id', (req, res, next) => {
  laptopGroupController.update(req, res, next);
});

laptopGroupRouter.delete('/:id', (req, res, next) => {
  laptopGroupController.delete(req, res, next);
});

export default laptopGroupRouter;

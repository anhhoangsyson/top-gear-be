import { Router } from 'express';
import { LaptopController } from '../controller/laptop.controller';
import { LaptopService } from '../service/laptop.service';
import { LaptopRepository } from '../repository/laptop.repository';
import upload, { uploadMultiple } from '../../../middlewares/upload/upload';
import authenticateJWT from '../../../middlewares/authenticate/authenticateJWT';

const laptopRouter = Router();

const laptopRepository = new LaptopRepository();
const laptopService = new LaptopService(laptopRepository);
const laptopController = new LaptopController(laptopService);

laptopRouter.post('/', uploadMultiple, (req, res, next) => {
  laptopController.createLaptop(req, res, next);
});

laptopRouter.patch('/:id/active', async (req, res, next) => {
  try {
    const laptop = await laptopController.setActiveStatus(req, res, next, true);
    res
      .status(200)
      .json({ data: laptop, message: 'Laptop activated successfully' });
  } catch (error) {
    next(error);
  }
});

laptopRouter.patch('/:id/inactive', async (req, res, next) => {
  try {
    const laptop = await laptopController.setActiveStatus(
      req,
      res,
      next,
      false,
    );
    res
      .status(200)
      .json({ data: laptop, message: 'Laptop inactivated successfully' });
  } catch (error) {
    next(error);
  }
});

laptopRouter.get('/brand/', (req, res, next) => {
  laptopController.findLaptopsByBrand(req, res, next);
});
laptopRouter.get('/category/', (req, res, next) => {
  laptopController.findLaptopsByCategory(req, res, next);
});
laptopRouter.get('/cab/', (req, res, next) => {
  laptopController.findLaptopsByCategoryAndBrand(req, res, next);
});

laptopRouter.get('/filter', (req, res, next) => {
  laptopController.filterLaptops(req, res, next);
});

laptopRouter.get('/related', (req, res, next) => {
  laptopController.getLaptopRelated(req, res, next);
});
laptopRouter.get('/:id', (req, res, next) => {
  laptopController.getLaptopById(req, res, next);
});

laptopRouter.get('/', (req, res, next) => {
  laptopController.getAllLaptops(req, res, next);
});

laptopRouter.put('/:id', (req, res, next) => {
  laptopController.updateLaptop(req, res, next);
});

laptopRouter.delete('/:id', (req, res, next) => {
  laptopController.deleteLaptop(req, res, next);
});

laptopRouter.post('/suggest-metadata', (req, res, next) => {
  laptopController.suggestMetadata(req, res, next);
});

laptopRouter.get('/slug/:slug', (req, res, next) => {
  laptopController.getLaptopBySlug(req, res, next);
});

export default laptopRouter;

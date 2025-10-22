import { Router } from 'express';
import { VoucherController } from '../controller/voucher.controller';

const voucherRouter = Router();
const controller = new VoucherController();

// CRUD cho admin
voucherRouter.get('/', (req, res) => controller.getAll(req, res));
voucherRouter.post('/', (req, res) => controller.create(req, res));
voucherRouter.get('/:id', (req, res) => controller.getById(req, res));
voucherRouter.patch('/:id', (req, res) => controller.update(req, res));
voucherRouter.delete('/:id', (req, res) => controller.delete(req, res));

// API cho khách hàng
voucherRouter.get('/customer/available', (req, res) =>
  controller.getAvailable(req, res),
);
voucherRouter.post('/customer/apply', (req, res) =>
  controller.applyCode(req, res),
);

export default voucherRouter;

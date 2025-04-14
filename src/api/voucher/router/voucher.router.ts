import { Router } from 'express';
import { VoucherController } from '../controller/voucher.controller'; // Ensure you have created the file vouchers.controller.ts
const vouchersRouter = Router();
const vouchersController = new VoucherController();
// Get all vouchers
vouchersRouter.get('/', (req, res) => {
  vouchersController.getAllVouchers(req, res);
});
// Create a new voucher
vouchersRouter.post('/', (req, res) => {
  vouchersController.createVoucher(req, res);
});
// Get a voucher by ID
vouchersRouter.get('/:id', (req, res) => {
  vouchersController.getVoucherById(req, res);
});
// Delete a voucher by ID
vouchersRouter.delete('/:id', (req, res) => {
  vouchersController.deleteVoucherById(req, res);
});
// Update a voucher by ID
vouchersRouter.patch('/:id', (req, res) => {
  vouchersController.updateVoucherById(req, res);
});
export default vouchersRouter;

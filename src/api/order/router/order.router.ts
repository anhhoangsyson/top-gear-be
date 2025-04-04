import { Router } from 'express';
import OrderController from '../controller/order.controller';
import authenticateJWT from '../../../middlewares/authenticate/authenticateJWT';
import { PaymentController } from '../controller/payment.controller';

const orderRouter = Router();
const orderController = new OrderController();
const paymentController = new PaymentController();
orderRouter.post('/', authenticateJWT, (req, res) => {
  orderController.createOrder(req, res);
});

orderRouter.post('/callback', (req, res) => {
  paymentController.handleCallback(req, res);
});

orderRouter.post('/query', authenticateJWT, (req, res) => {
  paymentController.queryTransactionStatus(req, res);
});

export default orderRouter;

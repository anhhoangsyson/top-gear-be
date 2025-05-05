import { Router } from 'express';
import OrderController from '../controller/order.controller';
import authenticateJWT from '../../../middlewares/authenticate/authenticateJWT';
import { PaymentController } from '../controller/payment.controller';

const orderRouter = Router();
const orderController = new OrderController();
const paymentController = new PaymentController();

orderRouter.get('/all', (req, res) => {
  orderController.getAllOrders(req, res);
});

orderRouter.post('/', authenticateJWT, (req, res) => {
  orderController.createOrder(req, res);
});

orderRouter.post('/callback', (req, res) => {
  paymentController.handleCallback(req, res);
});

orderRouter.post('/query', authenticateJWT, (req, res) => {
  paymentController.queryTransactionStatus(req, res);
});

orderRouter.get('/my', authenticateJWT, (req, res) => {
  orderController.getMyOrders(req, res);
});

orderRouter.get('/:id', authenticateJWT, (req, res) => {
  orderController.getOrderById(req, res);
});

orderRouter.put('/canceling-order/:id', authenticateJWT, (req, res) => {
  orderController.cancelingOrder(req, res);
});

orderRouter.put('/canceled-order/:id', (req, res) => {
  orderController.canceledOrder(req, res);
});

orderRouter.put('/compelete-order/:id', (req, res) => {
  orderController.compeleteOrder(req, res);
});

export default orderRouter;

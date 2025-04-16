import OrderService from '../service/order.service';
import { Request, Response } from 'express';
import { CreateOrderDto } from '../dto/order.dto';
import { OrderStatus } from '../schema/order.schema';
import { OrderRepository } from '../repository/order.repository';

export default class OrderController {
  private orderService = new OrderService();
  private orderRepository = new OrderRepository();
  async createOrder(req: Request, res: Response) {
    try {
      const createOrderDto = new CreateOrderDto(req.body);
      const customerId = req.user?._id;

      if (!customerId) {
        throw new Error('Cannot find customer information');
      }

      const order = await this.orderService.createOrder(
        createOrderDto,
        customerId,
      );
      res.status(201).json({
        data: order,
        message: 'Order created successfully',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
        error: (error as Error)?.message,
      });
    }
  }

  // private async updateOrderStatus(orderId: string, status: OrderStatus, transactionId: string, paymentUrl?: string) {
  //     const order = await this.orderService.findOrderById(orderId);
  //     if (!order) throw new Error("Đơn hàng không tồn tại");
  //     return this.OrderRepository.updateOrderStatus(orderId, status, transactionId);
  //   }

  async getOrderById(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      const order = await this.orderService.findOrderById(orderId);
      if (!order) {
        return res.status(201).json({
          message: 'Order not found',
        });
      }
      res.status(200).json({
        data: order,
        message: 'Order retrieved successfully',
      });
    } catch (error) {
      res.status(404).json({
        message: 'Internal server error',
        error: (error as Error)?.message,
      });
    }
  }

  async getMyOrders(req: Request, res: Response) {
    const customerId = req.user?._id;
    console.log('customerId', customerId);
    try {
      if (!customerId) {
        res.status(401).json({
          message: 'Unauthorized',
          error: 'Cannot find customer information',
        });
      }

      if (customerId) {
        const orders = await this.orderService.getMyOrders(customerId);
        res.status(200).json({
          data: orders,
          message: 'Orders retrieved successfully',
        });
      }
    } catch (error) {
      res.status(404).json({
        message: 'Internal server error',
        error: (error as Error)?.message,
      });
    }
  }
}

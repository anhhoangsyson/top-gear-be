import { IOrder, CreateOrderDto } from '../dto/order.dto'; // Đảm bảo rằng bạn đã tạo file order.dto.ts với interface IOrder và CreateOrderDto
import { OrdersRepository } from '../repository/order.repository'; // Đảm bảo rằng bạn đã tạo file orders.repository.ts với repository cho đơn hàng

export class OrderService {
  private orderRepository = new OrdersRepository();

  async getAllOrders(): Promise<IOrder[]> {
    return this.orderRepository.getAllOrders();
  }

  async createOrder(orderData: Partial<CreateOrderDto>): Promise<IOrder> {
    return await this.orderRepository.createOrder(orderData);
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    const order = await this.orderRepository.getOrderById(id);
    if (!order) {
      throw new Error('Order not found'); // Thông báo lỗi nếu không tìm thấy đơn hàng
    }
    return order;
  }

  async deleteOrderById(id: string): Promise<IOrder | null> {
    const order = await this.orderRepository.deleteOrderById(id);
    if (!order) {
      throw new Error('Order not found'); // Thông báo lỗi nếu không tìm thấy đơn hàng
    }
    return order;
  }

  async updateOrderById(
    id: string,
    orderData: Partial<IOrder>,
  ): Promise<IOrder | null> {
    const order = await this.orderRepository.updateOrderById(id, orderData);
    if (!order) {
      throw new Error('Order not found'); // Thông báo lỗi nếu không tìm thấy đơn hàng
    }
    return order;
  }
}

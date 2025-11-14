import { IOrder, CreateOrderDto } from '../dto/order.dto';

// Minimal in-memory repository implementation to satisfy types during build.
// Replace with real DB logic (mongoose) in production.
export class OrdersRepository {
  private orders: IOrder[] = [];

  async getAllOrders(): Promise<IOrder[]> {
    return this.orders;
  }

  async createOrder(orderData: Partial<CreateOrderDto>): Promise<IOrder> {
    const newOrder: IOrder = {
      _id: (Math.random() * 1000000).toFixed(0),
      userId: orderData.userId || '',
      items: orderData.items || [],
      total: orderData.total || 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    return this.orders.find((o) => o._id === id) || null;
  }

  async deleteOrderById(id: string): Promise<IOrder | null> {
    const idx = this.orders.findIndex((o) => o._id === id);
    if (idx === -1) return null;
    const [removed] = this.orders.splice(idx, 1);
    return removed;
  }

  async updateOrderById(
    id: string,
    orderData: Partial<IOrder>,
  ): Promise<IOrder | null> {
    const order = await this.getOrderById(id);
    if (!order) return null;
    const updated = Object.assign(order, orderData, { updatedAt: new Date() });
    return updated;
  }
}

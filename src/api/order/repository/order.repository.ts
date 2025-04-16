import Order, { OrderStatus, IOrder } from '../schema/order.schema';
import OrderDetail, {
  IOrderDetail,
} from '../../orderDetail/schema/orderDetail.schema';

export class OrderRepository {
  async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    const order = new Order(orderData);
    return await order.save();
  }

  async createOrderDetail(
    orderDetailData: IOrderDetail[],
  ): Promise<IOrderDetail[]> {
    return await OrderDetail.insertMany(orderDetailData);
  }

  async findOrderById(orderId: string): Promise<IOrder | null> {
    return await Order.findById(orderId).populate('orderDetails');
  }

  async updateStatus(
    idOrTransId: string,
    status: OrderStatus,
    transactionId?: string,
    paymentUrl?: string,
  ): Promise<IOrder | null> {
    const updateData: any = { orderStatus: status };
    if (transactionId) updateData.paymentTransactionId = transactionId;
    if (paymentUrl) updateData.paymentUrl = paymentUrl;

    // Nếu có transactionId (khi tạo đơn hàng), tìm bằng _id
    if (transactionId || paymentUrl) {
      return await Order.findOneAndUpdate(
        { _id: idOrTransId }, // Tìm bằng _id khi tạo đơn hàng
        updateData,
        { new: true },
      );
    }

    // Nếu không có transactionId hoặc paymentUrl (khi xử lý callback), tìm bằng paymentTransactionId
    return await Order.findOneAndUpdate(
      { paymentTransactionId: idOrTransId }, // Tìm bằng paymentTransactionId khi callback
      updateData,
      { new: true },
    );
  }

  async getMyOrders(customerId: string) {
    return await Order.find({ customerId: customerId });
  }
}

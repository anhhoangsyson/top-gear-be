import { CreateOrderDto, PaymentMethod } from '../dto/order.dto';
import { OrderRepository } from '../repository/order.repository';
import { Voucher } from '../../voucher/schema/voucher.schema';
import { OrderStatus } from '../schema/order.schema';
import { PaymentService } from './payment.service';
import Order from '../schema/order.schema';
import { Types } from 'mongoose';
import Laptop from '../../laptop/schema/laptop.schema';

export default class OrderService {
  private orderRepository = new OrderRepository();
  private paymentService = new PaymentService();
  async createOrder(
    createOrderData: CreateOrderDto,
    customerId: string,
  ): Promise<any> {
    const { address, paymentMethod, voucherCode, voucherId, cartItem, note } =
      createOrderData;
    const subTotal = cartItem.reduce(
      (sum, item) => sum + item.discountPrice * item.quantity,
      0,
    );

    let discountAmount = 0;
    console.log('voucehrid', voucherId);

    if (voucherId) {
      const voucher = await Voucher.findById(new Types.ObjectId(voucherId));
      console.log('voucher', voucher);

      if (!voucher) throw new Error('Voucher không tồn tại');
      if (new Date(voucher.expiredDate) < new Date())
        throw new Error('Voucher đã hết hạn');
      if (voucher.status !== 'active') throw new Error('Voucher không hợp lệ');

      if (voucher.pricePercent > 0) {
        // Giảm theo %
        discountAmount = Math.floor(subTotal * (voucher.pricePercent / 100));
        // Nếu có giới hạn số tiền giảm tối đa
      } else if (voucher.priceOrigin > 0) {
        // Giảm số tiền cố định
        discountAmount = voucher.priceOrigin;
        if (discountAmount > subTotal) discountAmount = subTotal;
      }
    }

    const intiialStatus =
      paymentMethod === 'zalopay'
        ? OrderStatus.PAYMENT_PENDING
        : OrderStatus.PENDING;

    console.log('discountAmount', discountAmount);
    console.log('totalAmount', subTotal - discountAmount);

    const orderData = {
      customerId,
      totalAmount: subTotal - discountAmount,
      orderStatus: intiialStatus,
      address,
      discountAmount,
      voucherId,
      paymentMethod,
      orderDetails: [], // Chưa có chi tiết đơn hàng tại thời điểm này
      note: note || '',
    };

    const order = (await this.orderRepository.createOrder(orderData)) as {
      _id: string;
      [key: string]: any;
    };

    const orderDetailsData = cartItem.map((item) => ({
      laptopId: new Types.ObjectId(item._id),
      quantity: item.quantity,
      price: item.discountPrice,
      subTotal: item.quantity * item.discountPrice,
    }));

    const createOrderDetails =
      await this.orderRepository.createOrderDetail(orderDetailsData);
    const orderDetailIds = createOrderDetails.map((item) => item._id);

    // await this.orderRepository.updateStatus(order._id as string, intiialStatus, undefined, undefined) // Gọi để lấy lại order
    await Order.findByIdAndUpdate(order._id, {
      $set: { orderDetails: orderDetailIds },
    });

    // handle case paymentMethod

    if (paymentMethod === PaymentMethod.CASH) {
      return {
        data: order,
        message: 'Đơn hàng đã được tạo, chờ xác nhận',
      };
    } else if (paymentMethod === PaymentMethod.ZALOPAY) {
      const paymentRes = await this.paymentService.processPayment(order, {
        totalAmount: order.totalAmount,
        paymentMethod,
        customerId,
        orderDetail: cartItem,
      });

      const orderRes = await this.orderRepository.findOrderById(
        order._id as string,
      );
      // return { data: order, payment: paymentRes, message: "vui long thanh toan" };
      // console.log('orderRes', orderRes);

      return {
        data: orderRes,
        payment: paymentRes,
        message: 'vui long thanh toan',
      };
    }
    // return order
  }

  async findOrderById(orderId: string) {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) throw new Error('Đơn hàng không tồn tại');
    return order;
  }

  async getMyOrders(customerId: string) {
    const orders = await this.orderRepository.getMyOrders(customerId);

    if (orders.length === 0) {
      return {
        message: 'Bạn chưa có đơn hàng nào',
      };
    }
    return orders;
  }

  async cancelingOrder(id: string) {
    return await this.orderRepository.cancelingOrder(id);
  }

  async canceledOrder(id: string) {
    return await this.orderRepository.canceledOrder(id);
  }

  async compeletedOrder(id: string) {
    return await this.orderRepository.compeleteOrder(id);
  }

  async changeOrderStatus(status: string, id: string) {
    // Lấy đơn hàng trước khi cập nhật
    const oldOrder = await Order.findById(id).populate('orderDetails');
    const order = await this.orderRepository.changeOrderStatus(status, id);

    // Nếu chuyển sang completed và trước đó chưa phải completed thì cập nhật stock
    if (
      order &&
      status === 'completed' &&
      oldOrder?.orderStatus !== 'completed'
    ) {
      if (oldOrder && oldOrder.orderDetails) {
        for (const detail of oldOrder.orderDetails as any[]) {
          await Laptop.updateOne(
            { _id: detail.laptopId },
            { $inc: { stock: -detail.quantity } },
          );
        }
      }
    }
    return order;
  }

  async getAllOrders() {
    const orders = await this.orderRepository.getAllOrders();
    if (orders.length === 0) {
      return {
        message: 'Không có đơn hàng nào',
      };
    }
    return orders;
  }

  getOrderDetailsById = async (orderId: string) => {
    return await this.orderRepository.getOrderDetailById(orderId);
  };
}

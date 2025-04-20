import { CreateOrderDto, PaymentMethod } from '../dto/order.dto';
import { OrderRepository } from '../repository/order.repository';
import { Voucher } from '../../voucher/schema/voucher.schema';
import { OrderStatus } from '../schema/order.schema';
import { PaymentService } from './payment.service';
import Order from '../schema/order.schema';

export default class OrderService {
  private orderRepository = new OrderRepository();
  private paymentService = new PaymentService();
  async createOrder(
    createOrderData: CreateOrderDto,
    customerId: string,
  ): Promise<any> {
    console.log('Entering findOrderById with orderId');
    const { address, paymentMethod, voucherCode, cartItem, note } =
      createOrderData;
    const subTotal = cartItem.reduce(
      (sum, item) => sum + item.variantPrice * item.quantity,
      0,
    );
    // const subTotal = 100
    let discountAmount = 0;
    let voucherId: string | null = null;

    // checkVoucher
    // if (voucherCode) {
    //   const voucher = await Voucher.findOne({ code: voucherCode }).lean();
    //   if (
    //     !voucher ||
    //     !voucher.status ||
    //     voucher. >= voucher.usageLimit
    //   ) {
    //     throw new Error('Voucher không hợp lệ hoặc đã hết lượt sử dụng');
    //   }
    //   if (subTotal < voucher.minOrderValue) {
    //     throw new Error('Giá trị đơn hàng không đủ để sử dụng voucher này');
    //   }
    //   discountAmount =
    //     voucher.discountType === 'fixed'
    //       ? voucher.discountValue
    //       : Math.min(
    //         subTotal * (voucher.discountValue / 100),
    //         voucher.maxDiscount,
    //       );
    //   voucherId = voucher._id.toString();
    //   await Voucher.findByIdAndUpdate(
    //     { code: voucherCode },
    //     { $inc: { usedCount: 1 } },
    //   );
    // }

    const intiialStatus =
      paymentMethod === 'zalopay'
        ? OrderStatus.PAYMENT_PENDING
        : OrderStatus.PENDING;

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
    console.log('order da tao', order);
    console.log('Cart items:', cartItem);
    const orderDetailsData = cartItem.map((item) => ({
      orderId: order._id,
      productVariantId: item._id,
      quantity: item.quantity,
      price: item.variantPrice,
      subTotal: item.quantity * item.variantPrice,
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
}

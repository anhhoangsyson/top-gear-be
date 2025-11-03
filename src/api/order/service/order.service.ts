import { CreateOrderDto, PaymentMethod } from '../dto/order.dto';
import { OrderRepository } from '../repository/order.repository';
import { Voucher } from '../../voucher/schema/voucher.schema';
import { OrderStatus } from '../schema/order.schema';
import { PaymentService } from './payment.service';
import Order from '../schema/order.schema';
import { Types } from 'mongoose';
import Laptop from '../../laptop/schema/laptop.schema';
import notificationService from '../../notification/service/notification.service';
import { notifyOrderStatusChanged } from '../../../middlewares/notification/notification.middleware';
import { Users } from '../../users/schema/user.schema';

export default class OrderService {
  private orderRepository = new OrderRepository();
  private paymentService = new PaymentService();

  // Helper function để lấy danh sách admin
  private async getAdminUserIds(): Promise<string[]> {
    try {
      const admins = await Users.find({ role: 'admin' }).select('_id');
      return admins.map((admin) => admin._id.toString());
    } catch (error) {
      console.error('Failed to get admin users:', error);
      return [];
    }
  }
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

    // ✅ Gửi notification cho khách hàng
    notificationService
      .createNotification({
        userId: customerId,
        type: 'order',
        title: '🎉 Đơn hàng đã được tạo!',
        message: `Đơn hàng #${order._id} của bạn đã được tạo thành công với tổng giá trị ${(subTotal - discountAmount).toLocaleString('vi-VN')}đ`,
        data: {
          orderId: order._id,
          totalAmount: subTotal - discountAmount,
          orderStatus: intiialStatus,
          paymentMethod,
        },
        link: `/orders/${order._id}`,
      })
      .catch((err) => console.error('Failed to send notification:', err));

    // ✅ Gửi notification cho tất cả admin
    const adminIds = await this.getAdminUserIds();
    if (adminIds.length > 0) {
      const adminNotifications = adminIds.map((adminId) => ({
        userId: adminId,
        type: 'order' as const,
        title: '📦 Đơn hàng mới',
        message: `Có đơn hàng mới #${order._id} với giá trị ${(subTotal - discountAmount).toLocaleString('vi-VN')}đ cần xử lý`,
        data: {
          orderId: order._id,
          customerId,
          totalAmount: subTotal - discountAmount,
          orderStatus: intiialStatus,
          paymentMethod,
          priority: subTotal - discountAmount > 20000000 ? 'high' : 'normal',
        },
        link: `/admin/orders/${order._id}`,
      }));

      notificationService
        .createBulkNotifications(adminNotifications)
        .catch((err) =>
          console.error('Failed to send admin notifications:', err),
        );
    }

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
    const order = await this.orderRepository.cancelingOrder(id);

    // ✅ Gửi notification khi đơn hàng bị hủy
    if (
      order &&
      typeof order === 'object' &&
      'customerId' in order &&
      order.customerId
    ) {
      notificationService
        .createNotification({
          userId: order.customerId.toString(),
          type: 'order',
          title: '❌ Đơn hàng đang được hủy',
          message: `Đơn hàng #${id} của bạn đang trong quá trình hủy`,
          data: { orderId: id, status: 'canceling' },
          link: `/orders/${id}`,
        })
        .catch((err) => console.error('Failed to send notification:', err));
    }

    return order;
  }

  async canceledOrder(id: string) {
    const order = await this.orderRepository.canceledOrder(id);

    // ✅ Gửi notification khi đơn hàng đã hủy
    if (order && order.customerId) {
      notificationService
        .createNotification({
          userId: order.customerId.toString(),
          type: 'order',
          title: '❌ Đơn hàng đã bị hủy',
          message: `Đơn hàng #${id} của bạn đã bị hủy thành công`,
          data: { orderId: id, status: 'cancelled' },
          link: `/orders/${id}`,
        })
        .catch((err) => console.error('Failed to send notification:', err));

      // ✅ Thông báo cho admin
      const adminIds = await this.getAdminUserIds();
      if (adminIds.length > 0) {
        const adminNotifications = adminIds.map((adminId) => ({
          userId: adminId,
          type: 'order' as const,
          title: '🔔 Đơn hàng đã bị hủy',
          message: `Đơn hàng #${id} đã bị hủy bởi khách hàng`,
          data: { orderId: id, status: 'cancelled' },
          link: `/admin/orders/${id}`,
        }));

        notificationService
          .createBulkNotifications(adminNotifications)
          .catch((err) =>
            console.error('Failed to send admin notifications:', err),
          );
      }
    }

    return order;
  }

  async compeletedOrder(id: string) {
    const order = await this.orderRepository.compeleteOrder(id);

    // ✅ Gửi notification khi đơn hàng hoàn thành
    if (
      order &&
      typeof order === 'object' &&
      'customerId' in order &&
      order.customerId
    ) {
      notificationService
        .createNotification({
          userId: order.customerId.toString(),
          type: 'order',
          title: '🎉 Giao hàng thành công!',
          message: `Đơn hàng #${id} đã được giao thành công. Cảm ơn bạn đã mua hàng tại Top Gear!`,
          data: { orderId: id, status: 'completed', canReview: true },
          link: `/orders/${id}`,
        })
        .catch((err) => console.error('Failed to send notification:', err));
    }

    return order;
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

    // ✅ Gửi notification khi trạng thái đơn hàng thay đổi
    if (order && order.customerId) {
      const statusMessages: { [key: string]: string } = {
        pending: 'đang chờ xử lý',
        confirmed: 'đã được xác nhận',
        processing: 'đang được xử lý',
        shipping: 'đang được giao',
        completed: 'đã được giao thành công',
        cancelled: 'đã bị hủy',
        payment_pending: 'đang chờ thanh toán',
      };

      const statusEmojis: { [key: string]: string } = {
        confirmed: '✅',
        processing: '📦',
        shipping: '🚚',
        completed: '🎉',
        cancelled: '❌',
      };

      notifyOrderStatusChanged(
        order.customerId.toString(),
        id,
        statusMessages[status] || status,
      ).catch((err) => console.error('Failed to send notification:', err));
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

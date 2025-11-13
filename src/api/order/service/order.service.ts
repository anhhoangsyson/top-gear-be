import { CreateOrderDto, PaymentMethod } from '../dto/order.dto';
import { OrderRepository } from '../repository/order.repository';
import { Voucher } from '../../voucher/schema/voucher.schema';
import { OrderStatus } from '../schema/order.schema';
import { PaymentService } from './payment.service';
import Order from '../schema/order.schema';
import { Types, startSession } from 'mongoose';
import Laptop from '../../laptop/schema/laptop.schema';
import notificationService from '../../notification/service/notification.service';
import { notifyOrderStatusChanged } from '../../../middlewares/notification/notification.middleware';
import { Users } from '../../users/schema/user.schema';
import { VoucherService } from '../../voucher/service/voucher.service';

export default class OrderService {
  private orderRepository = new OrderRepository();
  private paymentService = new PaymentService();
  private voucherService = new VoucherService();

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
    console.log('📊 Order Details:', {
      voucherId,
      subTotal,
      subTotalType: typeof subTotal,
      cartItem: cartItem.map((item) => ({
        id: item._id,
        price: item.discountPrice,
        quantity: item.quantity,
        total: item.discountPrice * item.quantity,
      })),
    });

    // ✅ 1. Check stock availability trước khi tạo order
    for (const item of cartItem) {
      const laptop = await Laptop.findById(item._id);
      if (!laptop) {
        throw new Error(`Sản phẩm ${item._id} không tồn tại`);
      }
      if (laptop.stock < item.quantity) {
        throw new Error(
          `Sản phẩm "${laptop.name}" không đủ hàng. Hiện có: ${laptop.stock}, yêu cầu: ${item.quantity}`,
        );
      }
    }

    const intiialStatus =
      paymentMethod === 'zalopay'
        ? OrderStatus.PAYMENT_PENDING
        : OrderStatus.PENDING;

    console.log('discountAmount', discountAmount);
    console.log('totalAmount', subTotal - discountAmount);

    // ✅ 2. Use MongoDB Transaction để đảm bảo atomicity
    const session = await startSession();
    session.startTransaction();

    try {
      // ✅ 2.1. Validate và reserve voucher TRONG transaction (nếu có)
      if (voucherId) {
        const result = await this.voucherService.validateAndReserveVoucher(
          voucherId,
          customerId,
          subTotal,
          session,
        );
        discountAmount = result.discountAmount;
        console.log('Voucher applied:', {
          voucherId,
          discountAmount,
          originalAmount: subTotal,
          finalAmount: subTotal - discountAmount,
        });
      }

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

      await Order.findByIdAndUpdate(
        order._id,
        { $set: { orderDetails: orderDetailIds } },
        { session },
      );

      // ✅ 3. Reserve stock (giảm stock ngay khi tạo order) - Atomic operation
      for (const item of cartItem) {
        const result = await Laptop.findOneAndUpdate(
          {
            _id: new Types.ObjectId(item._id),
            stock: { $gte: item.quantity }, // Chỉ update nếu stock >= quantity
          },
          { $inc: { stock: -item.quantity } },
          { new: true, session },
        );

        if (!result) {
          throw new Error(
            `Sản phẩm "${item._id}" không đủ hàng hoặc đã bị thay đổi`,
          );
        }
      }

      // ✅ 3.1. Tạo VoucherUsage record (nếu có voucher)
      if (voucherId) {
        await this.voucherService.createVoucherUsage(
          voucherId,
          customerId,
          order._id,
          discountAmount,
          session,
        );
      }

      // Commit transaction
      await session.commitTransaction();

      // ✅ Gửi notification sau khi commit thành công
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

      // ✅ Gửi notification cho TẤT CẢ admin với TẤT CẢ đơn hàng (không có filter)
      // Lưu ý: Tất cả đơn hàng đều được gửi notification, không phân biệt giá trị
      const adminIds = await this.getAdminUserIds();
      if (adminIds.length > 0) {
        const totalAmount = subTotal - discountAmount;

        // Tạo notifications cho tất cả admin
        const adminNotifications = adminIds.map((adminId) => ({
          userId: adminId,
          type: 'order' as const,
          title: '📦 Đơn hàng mới',
          message: `Có đơn hàng mới #${order._id} với giá trị ${totalAmount.toLocaleString('vi-VN')}đ cần xử lý`,
          data: {
            orderId: order._id,
            customerId,
            totalAmount: totalAmount,
            orderStatus: intiialStatus,
            paymentMethod,
            // Priority chỉ để frontend highlight, KHÔNG filter notifications
            // Đơn > 20tr = high priority (highlight đỏ), còn lại = normal
            priority: totalAmount > 20000000 ? 'high' : 'normal',
          },
          link: `/admin/orders/${order._id}`,
        }));

        console.log(
          `📤 Gửi notification cho ${adminIds.length} admin về đơn hàng #${order._id} (${totalAmount.toLocaleString('vi-VN')}đ)`,
        );

        notificationService
          .createBulkNotifications(adminNotifications)
          .then(() => {
            console.log(
              `✅ Đã gửi notification thành công cho ${adminIds.length} admin`,
            );
          })
          .catch((err) =>
            console.error('❌ Failed to send admin notifications:', err),
          );
      } else {
        console.warn(
          '⚠️ Không có admin nào trong hệ thống để gửi notification',
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

        return {
          data: orderRes,
          payment: paymentRes,
          message: 'vui long thanh toan',
        };
      }
    } catch (error) {
      // Rollback transaction nếu có lỗi
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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

    // ✅ Gửi notification khi đơn hàng đang được hủy
    if (
      order &&
      typeof order === 'object' &&
      'customerId' in order &&
      order.customerId
    ) {
      // Gửi notification cho customer
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

      // ✅ Thông báo cho admin khi customer yêu cầu hủy đơn
      const adminIds = await this.getAdminUserIds();
      if (adminIds.length > 0) {
        // Lấy thông tin đơn hàng để hiển thị giá trị
        const orderDetail = await this.orderRepository.findOrderById(id);
        const totalAmount = orderDetail?.totalAmount || 0;

        const adminNotifications = adminIds.map((adminId) => ({
          userId: adminId,
          type: 'order' as const,
          title: '⚠️ Yêu cầu hủy đơn hàng',
          message: `Khách hàng yêu cầu hủy đơn hàng #${id} với giá trị ${totalAmount.toLocaleString('vi-VN')}đ`,
          data: {
            orderId: id,
            customerId: order.customerId.toString(),
            totalAmount: totalAmount,
            status: 'canceling',
            action: 'customer_request_cancel',
          },
          link: `/admin/orders/${id}`,
        }));

        console.log(
          `📤 Gửi notification cho ${adminIds.length} admin về yêu cầu hủy đơn #${id}`,
        );

        notificationService
          .createBulkNotifications(adminNotifications)
          .then(() => {
            console.log(
              `✅ Đã gửi notification thành công cho ${adminIds.length} admin`,
            );
          })
          .catch((err) =>
            console.error('❌ Failed to send admin notifications:', err),
          );
      } else {
        console.warn(
          '⚠️ Không có admin nào trong hệ thống để gửi notification',
        );
      }
    }

    return order;
  }

  async canceledOrder(id: string) {
    const order = await this.orderRepository.canceledOrder(id);

    // ✅ Refund voucher khi order bị cancelled
    if (order && order.voucherId) {
      await this.voucherService.refundVoucher(id);
    }

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

      // ✅ Thông báo cho admin khi đơn hàng đã bị hủy
      const adminIds = await this.getAdminUserIds();
      if (adminIds.length > 0) {
        // Lấy thông tin đơn hàng để hiển thị giá trị
        const orderDetail = await this.orderRepository.findOrderById(id);
        const totalAmount = orderDetail?.totalAmount || 0;

        const adminNotifications = adminIds.map((adminId) => ({
          userId: adminId,
          type: 'order' as const,
          title: '🔔 Đơn hàng đã bị hủy',
          message: `Đơn hàng #${id} với giá trị ${totalAmount.toLocaleString('vi-VN')}đ đã bị hủy bởi khách hàng`,
          data: {
            orderId: id,
            customerId: order.customerId.toString(),
            totalAmount: totalAmount,
            status: 'cancelled',
            action: 'order_cancelled',
          },
          link: `/admin/orders/${id}`,
        }));

        console.log(
          `📤 Gửi notification cho ${adminIds.length} admin về đơn hàng đã hủy #${id}`,
        );

        notificationService
          .createBulkNotifications(adminNotifications)
          .then(() => {
            console.log(
              `✅ Đã gửi notification thành công cho ${adminIds.length} admin`,
            );
          })
          .catch((err) =>
            console.error('❌ Failed to send admin notifications:', err),
          );
      } else {
        console.warn(
          '⚠️ Không có admin nào trong hệ thống để gửi notification',
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

    // ✅ Restore stock nếu order bị cancelled (vì đã reserve stock khi tạo order)
    if (
      order &&
      status === 'cancelled' &&
      oldOrder?.orderStatus !== 'cancelled'
    ) {
      if (oldOrder && oldOrder.orderDetails) {
        for (const detail of oldOrder.orderDetails as any[]) {
          const laptopId =
            (detail.laptopId as any)?._id?.toString() ||
            detail.laptopId?.toString();
          if (laptopId) {
            await Laptop.findByIdAndUpdate(
              laptopId,
              { $inc: { stock: detail.quantity } }, // Restore stock
            );
          }
        }
      }

      // ✅ Refund voucher khi order bị cancelled by admin
      if (oldOrder && oldOrder.voucherId) {
        await this.voucherService.refundVoucher(id);
      }
    }

    // ✅ Note: Stock đã được giảm khi tạo order (reserve), không cần giảm lại khi completed

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

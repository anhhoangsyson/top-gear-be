/**
 * EXAMPLE: Cách sử dụng Notification System trong các service khác
 *
 * File này chứa các ví dụ thực tế về cách integrate notification
 * vào các service có sẵn trong project của bạn.
 */

import notificationService from '../service/notification.service';
import {
  notifyOrderCreated,
  notifyOrderStatusChanged,
  notifyNewComment,
  notifyNewLike,
  notifyPromotion,
  notifyProductBackInStock,
  notifyNewOrder,
} from '../../../middlewares/notification/notification.middleware';

// ============================================
// EXAMPLE 1: Order Service
// ============================================

export class OrderServiceExample {
  /**
   * Khi user tạo order mới
   */
  async createOrder(userId: string, orderData: any) {
    // 1. Tạo order
    const order = {
      _id: 'order_123',
      userId,
      ...orderData,
      status: 'pending',
      totalAmount: 1500000,
    };

    // 2. ✅ Gửi notification cho user
    await notifyOrderCreated(userId, order._id);

    // 3. ✅ Gửi notification cho admin
    const adminIds = ['admin_1', 'admin_2']; // Lấy từ database
    await notifyNewOrder(adminIds, order._id);

    return order;
  }

  /**
   * Khi admin xác nhận order
   */
  async confirmOrder(orderId: string, userId: string) {
    // Update order status
    const order = { _id: orderId, status: 'confirmed' };

    // ✅ Gửi notification
    await notifyOrderStatusChanged(userId, orderId, 'confirmed');

    return order;
  }

  /**
   * Khi đơn hàng được giao
   */
  async deliverOrder(orderId: string, userId: string) {
    // ✅ Gửi notification với custom message
    await notificationService.createNotification({
      userId,
      type: 'order',
      title: '🎉 Giao hàng thành công!',
      message: `Đơn hàng #${orderId} đã được giao thành công. Cảm ơn bạn đã mua hàng!`,
      data: {
        orderId,
        deliveredAt: new Date(),
        canReview: true,
      },
      link: `/orders/${orderId}/review`,
    });
  }
}

// ============================================
// EXAMPLE 2: Comment Service
// ============================================

export class CommentServiceExample {
  /**
   * Khi user comment vào blog post
   */
  async createComment(userId: string, postId: string, content: string) {
    // 1. Tạo comment
    const comment = {
      _id: 'comment_123',
      userId,
      postId,
      content,
    };

    // 2. Lấy thông tin post owner
    const post = { userId: 'post_owner_id' };
    const commenter = { name: 'John Doe' };

    // 3. ✅ Gửi notification cho post owner (nếu không phải chính họ)
    if (post.userId !== userId) {
      await notifyNewComment(post.userId, postId, commenter.name);
    }

    return comment;
  }

  /**
   * Khi ai đó reply comment của user
   */
  async replyComment(
    userId: string,
    parentCommentId: string,
    postId: string,
    content: string,
  ) {
    // 1. Tạo reply
    const reply = {
      _id: 'reply_123',
      userId,
      parentCommentId,
      postId,
      content,
    };

    // 2. Lấy thông tin parent comment owner
    const parentComment = { userId: 'parent_comment_owner_id' };
    const replier = { name: 'Jane Doe' };

    // 3. ✅ Gửi notification
    if (parentComment.userId !== userId) {
      await notificationService.createNotification({
        userId: parentComment.userId,
        type: 'comment',
        title: 'Phản hồi mới',
        message: `${replier.name} đã phản hồi bình luận của bạn`,
        data: { postId, commentId: parentCommentId, replyId: reply._id },
        link: `/posts/${postId}#comment-${parentCommentId}`,
      });
    }

    return reply;
  }
}

// ============================================
// EXAMPLE 3: Like Service
// ============================================

export class LikeServiceExample {
  /**
   * Khi user like một blog post
   */
  async likePost(userId: string, postId: string) {
    // 1. Tạo like
    const like = {
      _id: 'like_123',
      userId,
      postId,
    };

    // 2. Lấy thông tin post owner
    const post = { userId: 'post_owner_id' };
    const liker = { name: 'Alice' };

    // 3. ✅ Gửi notification cho post owner
    if (post.userId !== userId) {
      await notifyNewLike(post.userId, postId, liker.name);
    }

    return like;
  }

  /**
   * Khi bài viết đạt milestone likes
   */
  async checkLikeMilestone(
    postId: string,
    postOwnerId: string,
    likeCount: number,
  ) {
    const milestones = [10, 50, 100, 500, 1000];

    if (milestones.includes(likeCount)) {
      // ✅ Gửi notification
      await notificationService.createNotification({
        userId: postOwnerId,
        type: 'like',
        title: `🎉 ${likeCount} lượt thích!`,
        message: `Bài viết của bạn đã đạt ${likeCount} lượt thích!`,
        data: { postId, likeCount },
        link: `/posts/${postId}`,
      });
    }
  }
}

// ============================================
// EXAMPLE 4: Product Service
// ============================================

export class ProductServiceExample {
  /**
   * Khi sản phẩm có hàng trở lại
   */
  async restockProduct(productId: string, productName: string) {
    // 1. Update stock
    const product = { _id: productId, stock: 50 };

    // 2. Lấy danh sách users đã subscribe
    const subscribers = [
      { userId: 'user_1' },
      { userId: 'user_2' },
      { userId: 'user_3' },
    ];

    // 3. ✅ Gửi notification cho tất cả subscribers
    for (const subscriber of subscribers) {
      await notifyProductBackInStock(subscriber.userId, productId, productName);
    }

    return product;
  }

  /**
   * Khi sản phẩm giảm giá
   */
  async notifyProductDiscount(
    productId: string,
    productName: string,
    oldPrice: number,
    newPrice: number,
  ) {
    // Lấy danh sách users đã xem sản phẩm này
    const interestedUsers = ['user_1', 'user_2', 'user_3'];

    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

    // ✅ Gửi notification
    const notifications = interestedUsers.map((userId) => ({
      userId,
      type: 'product' as const,
      title: `🔥 Giảm giá ${discount}%!`,
      message: `${productName} đang giảm giá từ ${oldPrice.toLocaleString()}đ xuống ${newPrice.toLocaleString()}đ`,
      data: { productId, oldPrice, newPrice, discount },
      link: `/products/${productId}`,
    }));

    await notificationService.createBulkNotifications(notifications);
  }
}

// ============================================
// EXAMPLE 5: Voucher Service
// ============================================

export class VoucherServiceExample {
  /**
   * Gửi voucher cho tất cả users
   */
  async sendVoucherToAll(voucherCode: string, discount: number) {
    // Lấy tất cả active users
    const allUsers = ['user_1', 'user_2', 'user_3']; // Từ database

    // ✅ Gửi notification
    await notifyPromotion(
      allUsers,
      '🎁 Voucher mới dành cho bạn!',
      `Nhận ngay voucher giảm ${discount}% cho đơn hàng tiếp theo. Mã: ${voucherCode}`,
      {
        voucherCode,
        discount,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        link: '/vouchers',
      },
    );
  }

  /**
   * Gửi voucher sinh nhật
   */
  async sendBirthdayVoucher(userId: string, userName: string) {
    await notificationService.createNotification({
      userId,
      type: 'promotion',
      title: '🎂 Chúc mừng sinh nhật!',
      message: `Chúc mừng sinh nhật ${userName}! Nhận ngay voucher giảm 20% đặc biệt dành cho bạn.`,
      data: {
        voucherCode: 'BIRTHDAY20',
        discount: 20,
        isBirthday: true,
      },
      link: '/vouchers/birthday',
    });
  }

  /**
   * Thông báo voucher sắp hết hạn
   */
  async notifyVoucherExpiring(
    userId: string,
    voucherCode: string,
    expiryDate: Date,
  ) {
    const daysLeft = Math.ceil(
      (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    await notificationService.createNotification({
      userId,
      type: 'promotion',
      title: '⏰ Voucher sắp hết hạn!',
      message: `Voucher ${voucherCode} của bạn sẽ hết hạn trong ${daysLeft} ngày. Sử dụng ngay!`,
      data: { voucherCode, expiryDate, daysLeft },
      link: '/vouchers',
    });
  }
}

// ============================================
// EXAMPLE 6: User Service
// ============================================

export class UserServiceExample {
  /**
   * Chào mừng user mới
   */
  async welcomeNewUser(userId: string, userName: string) {
    await notificationService.createNotification({
      userId,
      type: 'system',
      title: `Xin chào ${userName}! 👋`,
      message:
        'Chào mừng bạn đến với Top Gear! Khám phá ngay các sản phẩm laptop chất lượng cao.',
      data: { isWelcome: true },
      link: '/products',
    });
  }

  /**
   * Nhắc nhở hoàn thiện profile
   */
  async remindCompleteProfile(userId: string) {
    await notificationService.createNotification({
      userId,
      type: 'system',
      title: 'Hoàn thiện hồ sơ của bạn',
      message:
        'Hãy hoàn thiện hồ sơ để có trải nghiệm mua sắm tốt nhất và nhận nhiều ưu đãi hơn!',
      data: { profileComplete: false },
      link: '/profile/edit',
    });
  }

  /**
   * Thông báo account được verify
   */
  async notifyAccountVerified(userId: string) {
    await notificationService.createNotification({
      userId,
      type: 'system',
      title: '✅ Tài khoản đã được xác thực',
      message:
        'Tài khoản của bạn đã được xác thực thành công. Bắt đầu mua sắm ngay!',
      data: { verified: true },
      link: '/products',
    });
  }
}

// ============================================
// EXAMPLE 7: Admin Service
// ============================================

export class AdminServiceExample {
  /**
   * Thông báo cho admin về order mới
   */
  async notifyAdminNewOrder(orderId: string, orderAmount: number) {
    const adminIds = ['admin_1', 'admin_2']; // Từ database

    const notifications = adminIds.map((userId) => ({
      userId,
      type: 'order' as const,
      title: '📦 Đơn hàng mới',
      message: `Có đơn hàng mới #${orderId} với giá trị ${orderAmount.toLocaleString()}đ cần xử lý`,
      data: {
        orderId,
        orderAmount,
        priority: orderAmount > 10000000 ? 'high' : 'normal',
      },
      link: `/admin/orders/${orderId}`,
    }));

    await notificationService.createBulkNotifications(notifications);
  }

  /**
   * Cảnh báo tồn kho thấp
   */
  async notifyLowStock(productId: string, productName: string, stock: number) {
    const adminIds = ['admin_1', 'admin_2'];

    const notifications = adminIds.map((userId) => ({
      userId,
      type: 'system' as const,
      title: '⚠️ Cảnh báo tồn kho',
      message: `Sản phẩm ${productName} chỉ còn ${stock} sản phẩm trong kho`,
      data: { productId, productName, stock, alert: 'low_stock' },
      link: `/admin/products/${productId}`,
    }));

    await notificationService.createBulkNotifications(notifications);
  }
}

// ============================================
// EXAMPLE 8: Batch Operations
// ============================================

export class BatchNotificationExample {
  /**
   * Gửi notification cho nhiều users cùng lúc (hiệu quả hơn)
   */
  async notifyFlashSale(
    productId: string,
    productName: string,
    discount: number,
  ) {
    // Lấy tất cả active users
    const allUsers = ['user_1', 'user_2', 'user_3']; // Từ database

    // ✅ Tạo bulk notifications (nhanh hơn loop)
    const notifications = allUsers.map((userId) => ({
      userId,
      type: 'promotion' as const,
      title: '⚡ Flash Sale!',
      message: `${productName} đang giảm ${discount}%! Số lượng có hạn, mua ngay!`,
      data: { productId, discount, isFlashSale: true },
      link: `/products/${productId}`,
    }));

    await notificationService.createBulkNotifications(notifications);
  }

  /**
   * Gửi notification cho segment users
   */
  async notifyVIPCustomers() {
    // Lấy VIP customers (đã mua > 20 triệu)
    const vipUsers = ['vip_user_1', 'vip_user_2'];

    const notifications = vipUsers.map((userId) => ({
      userId,
      type: 'promotion' as const,
      title: '👑 Ưu đãi VIP',
      message: 'Ưu đãi đặc biệt dành riêng cho khách hàng VIP. Giảm thêm 15%!',
      data: { segment: 'vip', discount: 15 },
      link: '/vip-deals',
    }));

    await notificationService.createBulkNotifications(notifications);
  }
}

// ============================================
// EXPORT ALL EXAMPLES
// ============================================

export const examples = {
  OrderServiceExample,
  CommentServiceExample,
  LikeServiceExample,
  ProductServiceExample,
  VoucherServiceExample,
  UserServiceExample,
  AdminServiceExample,
  BatchNotificationExample,
};

import notificationService from '../../api/notification/service/notification.service';

/**
 * Helper functions to emit notifications from anywhere in the application
 */

export const notifyOrderCreated = async (userId: string, orderId: string) => {
  await notificationService.notifyOrderUpdate(
    userId,
    orderId,
    'đã được tạo thành công',
    { status: 'created' },
  );
};

export const notifyOrderStatusChanged = async (
  userId: string,
  orderId: string,
  status: string,
) => {
  const statusMessages: { [key: string]: string } = {
    pending: 'đang chờ xử lý',
    confirmed: 'đã được xác nhận',
    processing: 'đang được xử lý',
    shipping: 'đang được giao',
    delivered: 'đã được giao thành công',
    cancelled: 'đã bị hủy',
    refunded: 'đã được hoàn tiền',
  };

  await notificationService.notifyOrderUpdate(
    userId,
    orderId,
    statusMessages[status] || status,
    { status },
  );
};

export const notifyNewComment = async (
  postOwnerId: string,
  postId: string,
  commenterName: string,
) => {
  await notificationService.notifyNewComment(
    postOwnerId,
    postId,
    commenterName,
  );
};

export const notifyNewLike = async (
  postOwnerId: string,
  postId: string,
  likerName: string,
) => {
  await notificationService.notifyNewLike(postOwnerId, postId, likerName);
};

export const notifyPromotion = async (
  userIds: string[],
  title: string,
  message: string,
  promotionData?: any,
) => {
  const notifications = userIds.map((userId) => ({
    userId,
    type: 'promotion' as const,
    title,
    message,
    data: promotionData,
    link: promotionData?.link || '/promotions',
  }));

  await notificationService.createBulkNotifications(notifications);
};

export const notifyProductBackInStock = async (
  userId: string,
  productId: string,
  productName: string,
) => {
  await notificationService.createNotification({
    userId,
    type: 'product',
    title: 'Sản phẩm đã có hàng trở lại',
    message: `${productName} đã có hàng trở lại. Đặt hàng ngay!`,
    data: { productId, productName },
    link: `/products/${productId}`,
  });
};

export const notifyLowStock = async (
  adminUserIds: string[],
  productId: string,
  productName: string,
  stock: number,
) => {
  const notifications = adminUserIds.map((userId) => ({
    userId,
    type: 'system' as const,
    title: 'Cảnh báo tồn kho thấp',
    message: `Sản phẩm ${productName} chỉ còn ${stock} sản phẩm trong kho`,
    data: { productId, productName, stock },
    link: `/admin/products/${productId}`,
  }));

  await notificationService.createBulkNotifications(notifications);
};

export const notifyNewOrder = async (
  adminUserIds: string[],
  orderId: string,
) => {
  const notifications = adminUserIds.map((userId) => ({
    userId,
    type: 'order' as const,
    title: 'Đơn hàng mới',
    message: `Có đơn hàng mới #${orderId} cần xử lý`,
    data: { orderId },
    link: `/admin/orders/${orderId}`,
  }));

  await notificationService.createBulkNotifications(notifications);
};

import notificationRepository from '../repository/notification.repository';
import { CreateNotificationDto } from '../dto/notification.dto';
import socketService from '../../../services/socket/socket.service';
import { INotification } from '../schema/notification.schema';

class NotificationService {
  async createNotification(
    data: CreateNotificationDto,
  ): Promise<INotification> {
    const notification = await notificationRepository.create(data);

    // Emit realtime notification to user
    socketService.emitToUser(data.userId, 'new_notification', {
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      link: notification.link,
      createdAt: notification.createdAt,
    });

    return notification;
  }

  async createBulkNotifications(
    notifications: CreateNotificationDto[],
  ): Promise<void> {
    const createdNotifications = await Promise.all(
      notifications.map((data) => notificationRepository.create(data)),
    );

    // Emit realtime notifications
    createdNotifications.forEach((notification) => {
      socketService.emitToUser(
        notification.userId.toString(),
        'new_notification',
        {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          link: notification.link,
          createdAt: notification.createdAt,
        },
      );
    });
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    isRead?: boolean,
    type?: string,
  ) {
    const { notifications, total, unreadCount } =
      await notificationRepository.findByUserId(
        userId,
        page,
        limit,
        isRead,
        type,
      );

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  async markAsRead(id: string, userId: string): Promise<INotification | null> {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    const updated = await notificationRepository.markAsRead(id);

    // Emit update to user
    if (updated) {
      const unreadCount = await notificationRepository.getUnreadCount(userId);
      socketService.emitToUser(userId, 'notification_read', {
        notificationId: id,
        unreadCount,
      });
    }

    return updated;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const count = await notificationRepository.markAllAsRead(userId);

    // Emit update to user
    socketService.emitToUser(userId, 'all_notifications_read', {
      unreadCount: 0,
    });

    return count;
  }

  async deleteNotification(id: string, userId: string): Promise<boolean> {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    const deleted = await notificationRepository.delete(id);

    if (deleted) {
      const unreadCount = await notificationRepository.getUnreadCount(userId);
      socketService.emitToUser(userId, 'notification_deleted', {
        notificationId: id,
        unreadCount,
      });
    }

    return deleted;
  }

  async deleteAllNotifications(userId: string): Promise<number> {
    const count = await notificationRepository.deleteAllByUserId(userId);

    socketService.emitToUser(userId, 'all_notifications_deleted', {
      unreadCount: 0,
    });

    return count;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await notificationRepository.getUnreadCount(userId);
  }

  // Helper methods for common notification types
  async notifyOrderUpdate(
    userId: string,
    orderId: string,
    status: string,
    orderData?: any,
  ) {
    return this.createNotification({
      userId,
      type: 'order',
      title: 'Cập nhật đơn hàng',
      message: `Đơn hàng #${orderId} của bạn đã được ${status}`,
      data: { orderId, status, ...orderData },
      link: `/orders/${orderId}`,
    });
  }

  async notifyNewComment(
    userId: string,
    postId: string,
    commenterName: string,
  ) {
    return this.createNotification({
      userId,
      type: 'comment',
      title: 'Bình luận mới',
      message: `${commenterName} đã bình luận bài viết của bạn`,
      data: { postId, commenterName },
      link: `/posts/${postId}`,
    });
  }

  async notifyNewLike(userId: string, postId: string, likerName: string) {
    return this.createNotification({
      userId,
      type: 'like',
      title: 'Lượt thích mới',
      message: `${likerName} đã thích bài viết của bạn`,
      data: { postId, likerName },
      link: `/posts/${postId}`,
    });
  }

  async notifyPromotion(
    userId: string,
    title: string,
    message: string,
    promotionData?: any,
  ) {
    return this.createNotification({
      userId,
      type: 'promotion',
      title,
      message,
      data: promotionData,
      link: promotionData?.link || '/promotions',
    });
  }
}

export default new NotificationService();

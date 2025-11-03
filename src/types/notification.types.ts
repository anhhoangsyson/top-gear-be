import { INotification } from '../api/notification/schema/notification.schema';

export type NotificationType =
  | 'order'
  | 'comment'
  | 'like'
  | 'system'
  | 'product'
  | 'promotion';

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  link?: string;
}

export interface NotificationResponse {
  notifications: INotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unreadCount: number;
}

export interface SocketNotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  link?: string;
  createdAt: Date;
}

export interface NotificationReadData {
  notificationId: string;
  unreadCount: number;
}

export { INotification };

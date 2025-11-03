import { Request, Response, NextFunction } from 'express';
import notificationService from '../service/notification.service';
import {
  createNotificationSchema,
  updateNotificationSchema,
  getNotificationsQuerySchema,
} from '../dto/notification.dto';

class NotificationController {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId =
        (req as any).user?.userId ||
        (req as any).user?._id ||
        (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const query = getNotificationsQuerySchema.parse(req.query);
      const page = parseInt(query.page);
      const limit = parseInt(query.limit);
      const isRead = query.isRead ? query.isRead === 'true' : undefined;

      const result = await notificationService.getUserNotifications(
        userId,
        page,
        limit,
        isRead,
        query.type,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId =
        (req as any).user?.userId ||
        (req as any).user?._id ||
        (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const count = await notificationService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        data: { unreadCount: count },
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId =
        (req as any).user?.userId ||
        (req as any).user?._id ||
        (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const notification = await notificationService.markAsRead(id, userId);

      res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId =
        (req as any).user?.userId ||
        (req as any).user?._id ||
        (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const count = await notificationService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: `Marked ${count} notifications as read`,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId =
        (req as any).user?.userId ||
        (req as any).user?._id ||
        (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      await notificationService.deleteNotification(id, userId);

      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAllNotifications(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId =
        (req as any).user?.userId ||
        (req as any).user?._id ||
        (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const count = await notificationService.deleteAllNotifications(userId);

      res.status(200).json({
        success: true,
        message: `Deleted ${count} notifications`,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin only - create notification manually
  async createNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createNotificationSchema.parse(req.body);
      const notification = await notificationService.createNotification(data);

      res.status(201).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();

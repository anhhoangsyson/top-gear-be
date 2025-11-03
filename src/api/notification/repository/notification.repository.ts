import NotificationModel, {
  INotification,
} from '../schema/notification.schema';
import { CreateNotificationDto } from '../dto/notification.dto';
import mongoose from 'mongoose';

export class NotificationRepository {
  async create(data: CreateNotificationDto): Promise<INotification> {
    const notification = new NotificationModel(data);
    return await notification.save();
  }

  async findById(id: string): Promise<INotification | null> {
    return await NotificationModel.findById(id);
  }

  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 20,
    isRead?: boolean,
    type?: string,
  ): Promise<{
    notifications: INotification[];
    total: number;
    unreadCount: number;
  }> {
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (isRead !== undefined) {
      query.isRead = isRead;
    }

    if (type) {
      query.type = type;
    }

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      NotificationModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NotificationModel.countDocuments(query),
      NotificationModel.countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
        isRead: false,
      }),
    ]);

    return {
      notifications: notifications as INotification[],
      total,
      unreadCount,
    };
  }

  async markAsRead(id: string): Promise<INotification | null> {
    return await NotificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await NotificationModel.updateMany(
      { userId: new mongoose.Types.ObjectId(userId), isRead: false },
      { isRead: true },
    );
    return result.modifiedCount;
  }

  async delete(id: string): Promise<boolean> {
    const result = await NotificationModel.findByIdAndDelete(id);
    return !!result;
  }

  async deleteAllByUserId(userId: string): Promise<number> {
    const result = await NotificationModel.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
    });
    return result.deletedCount;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await NotificationModel.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      isRead: false,
    });
  }
}

export default new NotificationRepository();

import { RatingRepository } from '../repository/rating.repository';
import { CreateRatingDto, UpdateRatingDto } from '../dto/rating.dto';
import { IRating } from '../schema/rating.schema';
import Order, { OrderStatus } from '../../order/schema/order.schema';
import mongoose from 'mongoose';
import Laptop from '../../laptop/schema/laptop.schema';
import notificationService from '../../notification/service/notification.service';
import { Users } from '../../users/schema/user.schema';
import OrderDetail from '../../orderDetail/schema/orderDetail.schema';

export class RatingService {
  private ratingRepository = new RatingRepository();

  async createRating(data: CreateRatingDto, userId: string): Promise<IRating> {
    // 1. Validate order exists và belongs to user
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    // 2. Validate order status = completed
    if (order.orderStatus !== OrderStatus.COMPLETED) {
      throw new Error(
        'Chỉ có thể đánh giá khi đơn hàng đã hoàn thành (status = completed)',
      );
    }

    // 3. Validate user is the owner of the order
    if (order.customerId.toString() !== userId) {
      throw new Error('Bạn không có quyền đánh giá đơn hàng này');
    }

    // 4. Validate laptopId belongs to order (nếu có)
    if (data.laptopId) {
      const orderWithDetails = await Order.findById(data.orderId).populate(
        'orderDetails',
      );
      if (!orderWithDetails) {
        throw new Error('Không tìm thấy chi tiết đơn hàng');
      }

      const orderDetails = orderWithDetails.orderDetails as any[];
      const laptopInOrder = orderDetails.some((detail: any) => {
        // Handle both populated and non-populated orderDetails
        const detailLaptopId =
          detail.laptopId?._id?.toString() ||
          detail.laptopId?.toString() ||
          detail.laptopId?.toString();
        return detailLaptopId === data.laptopId;
      });

      if (!laptopInOrder) {
        throw new Error('Sản phẩm này không thuộc đơn hàng của bạn');
      }
    }

    // 5. Check if user already rated this order/laptop
    const existingRating = await this.ratingRepository.findRatingByOrderAndUser(
      data.orderId,
      userId,
      data.laptopId || null,
    );

    if (existingRating) {
      throw new Error('Bạn đã đánh giá đơn hàng/sản phẩm này rồi');
    }

    // 6. Create rating
    const rating = await this.ratingRepository.createRating({
      orderId: new mongoose.Types.ObjectId(data.orderId),
      userId: new mongoose.Types.ObjectId(userId),
      laptopId: data.laptopId
        ? new mongoose.Types.ObjectId(data.laptopId)
        : null,
      rating: data.rating,
      comment: data.comment || '',
    });

    // 7. Update laptop ratings nếu có laptopId
    if (data.laptopId) {
      await this.updateLaptopRatings(data.laptopId);
    }

    // 8. ✅ Send notifications
    try {
      const user = await Users.findById(userId);
      const userName = user?.fullname || 'Khách hàng';
      const laptop = data.laptopId
        ? await Laptop.findById(data.laptopId)
        : null;
      const laptopName = laptop?.name || 'Sản phẩm';

      // Notify admin about new rating
      const adminUsers = await Users.find({
        role: { $in: ['admin', 'manager'] },
      });
      if (adminUsers.length > 0) {
        const isNegativeRating = data.rating < 3;
        const adminNotifications = adminUsers.map((admin) => ({
          userId: admin._id.toString(),
          type: 'rating' as const,
          title: isNegativeRating ? '⚠️ Đánh giá tiêu cực' : '⭐ Đánh giá mới',
          message: `${userName} đã đánh giá ${data.rating} sao cho ${laptopName || 'đơn hàng'}`,
          data: {
            ratingId: (rating as any)._id.toString(),
            orderId: data.orderId,
            laptopId: data.laptopId || null,
            rating: data.rating,
            userName,
            laptopName,
            isNegative: isNegativeRating,
          },
          link: data.laptopId
            ? `/admin/ratings?laptopId=${data.laptopId}`
            : `/admin/ratings?orderId=${data.orderId}`,
        }));

        await notificationService.createBulkNotifications(adminNotifications);
      }
    } catch (error) {
      console.error('Failed to send rating notifications:', error);
      // Don't throw error, just log it
    }

    return rating;
  }

  async updateRating(
    ratingId: string,
    data: UpdateRatingDto,
    userId: string,
  ): Promise<IRating> {
    const rating = await this.ratingRepository.findRatingById(ratingId);
    if (!rating) {
      throw new Error('Đánh giá không tồn tại');
    }

    // Validate user is the owner
    if (rating.userId.toString() !== userId) {
      throw new Error('Bạn không có quyền chỉnh sửa đánh giá này');
    }

    const updatedRating = await this.ratingRepository.updateRating(
      ratingId,
      data,
    );

    if (!updatedRating) {
      throw new Error('Không thể cập nhật đánh giá');
    }

    // Update laptop ratings nếu có laptopId
    if (updatedRating.laptopId) {
      await this.updateLaptopRatings(updatedRating.laptopId.toString());
    }

    return updatedRating;
  }

  async deleteRating(ratingId: string, userId: string): Promise<boolean> {
    const rating = await this.ratingRepository.findRatingById(ratingId);
    if (!rating) {
      throw new Error('Đánh giá không tồn tại');
    }

    // Validate user is the owner
    if (rating.userId.toString() !== userId) {
      throw new Error('Bạn không có quyền xóa đánh giá này');
    }

    const laptopId = rating.laptopId?.toString();

    const deleted = await this.ratingRepository.deleteRating(ratingId);

    // Update laptop ratings nếu có laptopId
    if (deleted && laptopId) {
      await this.updateLaptopRatings(laptopId);
    }

    return deleted;
  }

  async getRatingsByOrder(orderId: string): Promise<IRating[]> {
    return await this.ratingRepository.findRatingsByOrder(orderId);
  }

  async getRatingsByLaptop(
    laptopId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return await this.ratingRepository.findRatingsByLaptop(
      laptopId,
      page,
      limit,
    );
  }

  async getRatingsByUser(userId: string, page: number = 1, limit: number = 20) {
    return await this.ratingRepository.findRatingsByUser(userId, page, limit);
  }

  async getRatingById(ratingId: string): Promise<IRating | null> {
    return await this.ratingRepository.findRatingById(ratingId);
  }

  async getLaptopRatingStats(laptopId: string) {
    return await this.ratingRepository.getLaptopRatingStats(laptopId);
  }

  // Helper: Update laptop ratings average and count
  private async updateLaptopRatings(laptopId: string): Promise<void> {
    try {
      const stats = await this.ratingRepository.getLaptopRatingStats(laptopId);

      await Laptop.findByIdAndUpdate(laptopId, {
        'ratings.average': stats.average,
        'ratings.count': stats.count,
      });

      console.log(
        `✅ Updated laptop ${laptopId} ratings: ${stats.average}/5 (${stats.count} reviews)`,
      );
    } catch (error) {
      console.error('❌ Failed to update laptop ratings:', error);
    }
  }

  // Admin methods
  async getAllRatings(
    filters: {
      orderId?: string;
      userId?: string;
      laptopId?: string;
      rating?: number;
      search?: string;
    },
    page: number = 1,
    limit: number = 20,
  ) {
    return await this.ratingRepository.findAllRatings(filters, page, limit);
  }

  async getOverallStats() {
    return await this.ratingRepository.getOverallStats();
  }

  async deleteRatingByAdmin(ratingId: string): Promise<boolean> {
    const rating = await this.ratingRepository.findRatingById(ratingId);
    if (!rating) {
      throw new Error('Đánh giá không tồn tại');
    }

    const laptopId = rating.laptopId?.toString();
    const deleted = await this.ratingRepository.deleteRating(ratingId);

    // Update laptop ratings nếu có laptopId
    if (deleted && laptopId) {
      await this.updateLaptopRatings(laptopId);
    }

    return deleted;
  }
}

export default new RatingService();

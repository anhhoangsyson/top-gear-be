import { Request, Response, NextFunction } from 'express';
import ratingService from '../service/rating.service';
import {
  createRatingSchema,
  updateRatingSchema,
  queryRatingSchema,
  adminReplySchema,
  updateStatusSchema,
} from '../dto/rating.dto';

export class RatingController {
  async createRating(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const validatedData = createRatingSchema.parse(req.body);
      const rating = await ratingService.createRating(validatedData, userId);

      res.status(201).json({
        success: true,
        data: rating,
        message: 'Đánh giá thành công',
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      if (
        error.message.includes('không tồn tại') ||
        error.message.includes('không có quyền') ||
        error.message.includes('đã đánh giá') ||
        error.message.includes('Chỉ có thể đánh giá')
      ) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async updateRating(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const validatedData = updateRatingSchema.parse(req.body);
      const rating = await ratingService.updateRating(
        id,
        validatedData,
        userId,
      );

      res.status(200).json({
        success: true,
        data: rating,
        message: 'Cập nhật đánh giá thành công',
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      if (
        error.message.includes('không tồn tại') ||
        error.message.includes('không có quyền')
      ) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async deleteRating(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const deleted = await ratingService.deleteRating(id, userId);

      if (deleted) {
        res.status(200).json({
          success: true,
          message: 'Xóa đánh giá thành công',
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy đánh giá',
        });
      }
    } catch (error: any) {
      if (
        error.message.includes('không tồn tại') ||
        error.message.includes('không có quyền')
      ) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async getRatingsByOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { orderId } = req.params;
      const ratings = await ratingService.getRatingsByOrder(orderId);

      res.status(200).json({
        success: true,
        data: ratings,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRatingsByLaptop(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { laptopId } = req.params;
      const query = queryRatingSchema.parse(req.query);
      const result = await ratingService.getRatingsByLaptop(
        laptopId,
        query.page || 1,
        query.limit || 20,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      next(error);
    }
  }

  async getRatingsByUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const query = queryRatingSchema.parse(req.query);
      const result = await ratingService.getRatingsByUser(
        userId,
        query.page || 1,
        query.limit || 20,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      next(error);
    }
  }

  async getRatingById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const rating = await ratingService.getRatingById(id);

      if (!rating) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy đánh giá',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: rating,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLaptopRatingStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { laptopId } = req.params;
      const stats = await ratingService.getLaptopRatingStats(laptopId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin methods
  async getAllRatings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query = queryRatingSchema.parse(req.query);
      const filters: any = {};

      if (req.query.orderId) {
        filters.orderId = req.query.orderId as string;
      }
      if (req.query.userId) {
        filters.userId = req.query.userId as string;
      }
      if (req.query.laptopId) {
        filters.laptopId = req.query.laptopId as string;
      }
      if (req.query.rating) {
        filters.rating = parseInt(req.query.rating as string);
      }
      if (req.query.status) {
        filters.status = req.query.status as string;
      }
      if (req.query.search) {
        filters.search = req.query.search as string;
      }

      const result = await ratingService.getAllRatings(
        filters,
        query.page || 1,
        query.limit || 20,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      next(error);
    }
  }

  async getOverallStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const stats = await ratingService.getOverallStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRatingByAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await ratingService.deleteRatingByAdmin(id);

      if (deleted) {
        res.status(200).json({
          success: true,
          message: 'Xóa đánh giá thành công',
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy đánh giá',
        });
      }
    } catch (error: any) {
      if (error.message.includes('không tồn tại')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  // Admin Reply Methods
  async addAdminReply(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const adminId = req.user?._id;
      if (!adminId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const validatedData = adminReplySchema.parse(req.body);

      const rating = await ratingService.addAdminReply(
        id,
        adminId,
        validatedData.content,
      );

      res.status(200).json({
        success: true,
        data: rating,
        message: 'Trả lời đánh giá thành công',
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      if (error.message.includes('không tồn tại')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async updateAdminReply(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = adminReplySchema.parse(req.body);

      const rating = await ratingService.updateAdminReply(
        id,
        validatedData.content,
      );

      res.status(200).json({
        success: true,
        data: rating,
        message: 'Cập nhật trả lời thành công',
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      if (error.message.includes('không tồn tại')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async deleteAdminReply(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const rating = await ratingService.deleteAdminReply(id);

      res.status(200).json({
        success: true,
        data: rating,
        message: 'Xóa trả lời thành công',
      });
    } catch (error: any) {
      if (error.message.includes('không tồn tại')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  // Status Management
  async updateRatingStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateStatusSchema.parse(req.body);

      const rating = await ratingService.updateRatingStatus(
        id,
        validatedData.status,
      );

      res.status(200).json({
        success: true,
        data: rating,
        message: 'Cập nhật trạng thái thành công',
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      if (error.message.includes('không tồn tại')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }
}

export default new RatingController();

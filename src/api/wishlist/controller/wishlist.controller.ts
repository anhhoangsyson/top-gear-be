import { Request, Response, NextFunction } from 'express';
import { WishlistService } from '../service/wishlist.service';
import { createWishlistSchema, queryWishlistSchema } from '../dto/wishlist.dto';

export class WishlistController {
  private wishlistService = new WishlistService();

  async addToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const validatedData = createWishlistSchema.parse(req.body);
      const wishlist = await this.wishlistService.addToWishlist(
        userId,
        validatedData,
      );

      res.status(201).json({
        success: true,
        data: wishlist,
        message: 'Đã thêm vào wishlist',
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

  async removeFromWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { laptopId } = req.params;
      if (!laptopId) {
        res.status(400).json({ message: 'Laptop ID là bắt buộc' });
        return;
      }

      await this.wishlistService.removeFromWishlist(userId, laptopId);

      res.status(200).json({
        success: true,
        message: 'Đã xóa khỏi wishlist',
      });
    } catch (error) {
      next(error);
    }
  }

  async getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const validatedQuery = queryWishlistSchema.parse(req.query);
      const page = parseInt(validatedQuery.page);
      const limit = parseInt(validatedQuery.limit);

      const result = await this.wishlistService.getWishlist(
        userId,
        page,
        limit,
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

  async checkInWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { laptopId } = req.params;
      if (!laptopId) {
        res.status(400).json({ message: 'Laptop ID là bắt buộc' });
        return;
      }

      const inWishlist = await this.wishlistService.checkInWishlist(
        userId,
        laptopId,
      );

      res.status(200).json({
        success: true,
        data: { inWishlist },
      });
    } catch (error) {
      next(error);
    }
  }

  async getWishlistCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const count = await this.wishlistService.getWishlistCount(userId);

      res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }
}

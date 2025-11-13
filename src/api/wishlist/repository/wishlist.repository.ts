import Wishlist, { IWishlist } from '../schema/wishlist.schema';
import mongoose from 'mongoose';
import Laptop from '../../laptop/schema/laptop.schema';

export class WishlistRepository {
  async createWishlist(userId: string, laptopId: string): Promise<IWishlist> {
    const wishlist = new Wishlist({
      userId: new mongoose.Types.ObjectId(userId),
      laptopId: new mongoose.Types.ObjectId(laptopId),
    });
    return await wishlist.save();
  }

  async findWishlistByUserAndLaptop(
    userId: string,
    laptopId: string,
  ): Promise<IWishlist | null> {
    return await Wishlist.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      laptopId: new mongoose.Types.ObjectId(laptopId),
    });
  }

  async getWishlistByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    wishlists: IWishlist[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [wishlists, total] = await Promise.all([
      Wishlist.find({ userId: new mongoose.Types.ObjectId(userId) })
        .populate('laptopId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Wishlist.countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
    ]);

    return {
      wishlists,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteWishlist(userId: string, laptopId: string): Promise<boolean> {
    const result = await Wishlist.deleteOne({
      userId: new mongoose.Types.ObjectId(userId),
      laptopId: new mongoose.Types.ObjectId(laptopId),
    });
    return result.deletedCount > 0;
  }

  async checkProductInWishlist(
    userId: string,
    laptopId: string,
  ): Promise<boolean> {
    const wishlist = await this.findWishlistByUserAndLaptop(userId, laptopId);
    return !!wishlist;
  }

  async getWishlistCount(userId: string): Promise<number> {
    return await Wishlist.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
    });
  }
}

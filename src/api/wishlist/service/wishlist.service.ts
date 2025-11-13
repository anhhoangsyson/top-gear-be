import { WishlistRepository } from '../repository/wishlist.repository';
import { CreateWishlistDto } from '../dto/wishlist.dto';
import { IWishlist } from '../schema/wishlist.schema';
import Laptop from '../../laptop/schema/laptop.schema';

export class WishlistService {
  private wishlistRepository = new WishlistRepository();

  async addToWishlist(
    userId: string,
    data: CreateWishlistDto,
  ): Promise<IWishlist> {
    // Validate laptop exists
    const laptop = await Laptop.findById(data.laptopId);
    if (!laptop) {
      throw new Error('Sản phẩm không tồn tại');
    }

    // Check if already in wishlist
    const existing = await this.wishlistRepository.findWishlistByUserAndLaptop(
      userId,
      data.laptopId,
    );
    if (existing) {
      throw new Error('Sản phẩm đã có trong wishlist');
    }

    return await this.wishlistRepository.createWishlist(userId, data.laptopId);
  }

  async removeFromWishlist(userId: string, laptopId: string): Promise<boolean> {
    // Validate laptop exists
    const laptop = await Laptop.findById(laptopId);
    if (!laptop) {
      throw new Error('Sản phẩm không tồn tại');
    }

    const deleted = await this.wishlistRepository.deleteWishlist(
      userId,
      laptopId,
    );
    if (!deleted) {
      throw new Error('Sản phẩm không có trong wishlist');
    }

    return true;
  }

  async getWishlist(userId: string, page: number = 1, limit: number = 20) {
    return await this.wishlistRepository.getWishlistByUser(userId, page, limit);
  }

  async checkInWishlist(userId: string, laptopId: string): Promise<boolean> {
    return await this.wishlistRepository.checkProductInWishlist(
      userId,
      laptopId,
    );
  }

  async getWishlistCount(userId: string): Promise<number> {
    return await this.wishlistRepository.getWishlistCount(userId);
  }
}

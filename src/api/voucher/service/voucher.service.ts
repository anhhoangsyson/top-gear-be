import { VoucherRepository } from '../repository/voucher.repository';
import { IVoucher, CreateVoucherDto } from '../dto/vocher.dto';
import { Voucher, VoucherUsage } from '../schema/voucher.schema';
import { Types, ClientSession } from 'mongoose';

export class VoucherService {
  private repo = new VoucherRepository();

  async getAll() {
    return this.repo.getAll();
  }

  async getById(id: string) {
    return this.repo.getById(id);
  }

  async create(data: CreateVoucherDto) {
    return this.repo.create(data);
  }

  async update(id: string, data: Partial<CreateVoucherDto>) {
    return this.repo.update(id, data);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  async getAvailableVouchers() {
    return this.repo.getAvailableVouchers();
  }

  async applyVoucherCode(code: string, orderAmount?: number) {
    const voucher = await this.repo.getByCode(code);
    if (
      !voucher ||
      voucher.status !== 'active' ||
      new Date(voucher.expiredDate) < new Date() ||
      voucher.type !== 'code'
    ) {
      throw new Error('Voucher không hợp lệ hoặc đã hết hạn');
    }

    // ✅ Kiểm tra giá trị đơn hàng tối thiểu - LUÔN yêu cầu orderAmount nếu voucher có minPrice
    if (voucher.minPrice > 0) {
      if (orderAmount === undefined || orderAmount === null) {
        throw new Error(
          'Vui lòng cung cấp giá trị đơn hàng để kiểm tra voucher',
        );
      }
      if (orderAmount <= voucher.minPrice) {
        throw new Error(
          `Đơn hàng phải có giá trị lớn hơn ${voucher.minPrice.toLocaleString('vi-VN')}đ để áp dụng voucher này. Giá trị hiện tại: ${orderAmount.toLocaleString('vi-VN')}đ`,
        );
      }
    }

    // ✅ Kiểm tra số lượng còn lại
    if (voucher.currentUsage >= voucher.maxUsage) {
      throw new Error('Voucher đã hết lượt sử dụng');
    }

    return voucher;
  }

  /**
   * Centralized validation và reserve voucher với atomic operation
   * SỬ DỤNG TRONG TRANSACTION của order creation
   */
  async validateAndReserveVoucher(
    voucherId: string,
    userId: string,
    orderAmount: number,
    session: ClientSession,
  ): Promise<{ voucher: IVoucher; discountAmount: number }> {
    // ✅ 1. Atomic increment currentUsage - PREVENT RACE CONDITION
    const voucher = await Voucher.findOneAndUpdate(
      {
        _id: new Types.ObjectId(voucherId),
        status: 'active',
        $expr: { $lt: ['$currentUsage', '$maxUsage'] }, // So sánh 2 fields
      },
      { $inc: { currentUsage: 1 } },
      { session, new: true },
    );

    if (!voucher) {
      throw new Error(
        'Voucher không hợp lệ, đã hết hạn, hoặc đã hết lượt sử dụng',
      );
    }

    // ✅ 2. Validate expiredDate
    if (new Date(voucher.expiredDate) < new Date()) {
      // Rollback currentUsage vì voucher hết hạn
      await Voucher.findByIdAndUpdate(
        voucherId,
        { $inc: { currentUsage: -1 } },
        { session },
      );
      throw new Error('Voucher đã hết hạn');
    }

    // ✅ 3. Validate minPrice
    console.log('🔍 Validating minPrice:', {
      voucherMinPrice: voucher.minPrice,
      orderAmount: orderAmount,
      minPriceType: typeof voucher.minPrice,
      orderAmountType: typeof orderAmount,
      comparison: orderAmount <= voucher.minPrice,
      shouldFail: voucher.minPrice > 0 && orderAmount <= voucher.minPrice,
    });

    if (voucher.minPrice > 0 && orderAmount <= voucher.minPrice) {
      // Rollback currentUsage
      await Voucher.findByIdAndUpdate(
        voucherId,
        { $inc: { currentUsage: -1 } },
        { session },
      );
      throw new Error(
        `Đơn hàng phải có giá trị lớn hơn ${voucher.minPrice.toLocaleString('vi-VN')}đ để áp dụng voucher này. Giá trị hiện tại: ${orderAmount.toLocaleString('vi-VN')}đ`,
      );
    }

    // ✅ 4. Calculate discount
    let discountAmount = 0;
    if (voucher.pricePercent > 0) {
      // Giảm theo %
      discountAmount = Math.floor(orderAmount * (voucher.pricePercent / 100));

      // ✅ Apply maxDiscountAmount nếu có
      if (
        voucher.maxDiscountAmount > 0 &&
        discountAmount > voucher.maxDiscountAmount
      ) {
        discountAmount = voucher.maxDiscountAmount;
      }
    } else if (voucher.priceOrigin > 0) {
      // Giảm số tiền cố định
      discountAmount = voucher.priceOrigin;
      if (discountAmount > orderAmount) discountAmount = orderAmount;
    }

    return { voucher, discountAmount };
  }

  /**
   * Tạo VoucherUsage record sau khi order created thành công
   */
  async createVoucherUsage(
    voucherId: string,
    userId: string,
    orderId: string,
    discountAmount: number,
    session: ClientSession,
  ) {
    await VoucherUsage.create(
      [
        {
          voucherId,
          userId,
          orderId,
          discountAmount,
          usedAt: new Date(),
          status: 'active',
        },
      ],
      { session },
    );
  }

  /**
   * Rollback voucher khi order bị cancelled
   */
  async refundVoucher(orderId: string) {
    // Tìm usage record
    const usage = await VoucherUsage.findOne({ orderId, status: 'active' });

    if (!usage) {
      console.log(`No active voucher usage found for order ${orderId}`);
      return;
    }

    // Giảm currentUsage
    await Voucher.findByIdAndUpdate(usage.voucherId, {
      $inc: { currentUsage: -1 },
    });

    // Đánh dấu usage là refunded
    await VoucherUsage.findByIdAndUpdate(usage._id, {
      status: 'refunded',
    });

    console.log(`✅ Refunded voucher ${usage.voucherId} for order ${orderId}`);
  }
}

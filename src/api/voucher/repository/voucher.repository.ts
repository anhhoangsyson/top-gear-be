import Voucher, { IVoucher } from '../schema/voucher.schema';

class VoucherRepository {
  async findVoucherByCode(code: string): Promise<IVoucher | null> {
    return await Voucher.findOne({ code }).exec();
  }

  async updateVoucherUsageCount(code: string): Promise<IVoucher | null> {
    return await Voucher.findByIdAndUpdate(
      code,
      { $inc: { usedCount: 1 } },
      { new: true },
    );
  }
}
export default new VoucherRepository();

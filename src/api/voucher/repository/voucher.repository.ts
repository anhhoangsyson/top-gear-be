import { Voucher } from '../schema/voucher.schema';
import { IVoucher, CreateVoucherDto } from '../dto/vocher.dto';

export class VoucherRepository {
  async getAll(): Promise<IVoucher[]> {
    return Voucher.find().lean();
  }

  async getById(id: string): Promise<IVoucher | null> {
    return Voucher.findById(id).lean();
  }

  async getByCode(code: string): Promise<IVoucher | null> {
    return Voucher.findOne({ code }).lean();
  }

  async create(data: CreateVoucherDto): Promise<IVoucher> {
    const voucher = new Voucher(data);
    return voucher.save();
  }

  async update(
    id: string,
    data: Partial<CreateVoucherDto>,
  ): Promise<IVoucher | null> {
    return Voucher.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id: string): Promise<IVoucher | null> {
    return Voucher.findByIdAndDelete(id).lean();
  }

  async getAvailableVouchers(): Promise<IVoucher[]> {
    const now = new Date();
    return Voucher.find({
      status: 'active',
      expiredDate: { $gte: now },
    }).lean();
  }
}

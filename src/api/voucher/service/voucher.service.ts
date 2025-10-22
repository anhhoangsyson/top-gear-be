import { VoucherRepository } from '../repository/voucher.repository';
import { IVoucher, CreateVoucherDto } from '../dto/vocher.dto';

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

  async applyVoucherCode(code: string) {
    const voucher = await this.repo.getByCode(code);
    if (
      !voucher ||
      voucher.status !== 'active' ||
      new Date(voucher.expiredDate) < new Date() ||
      voucher.type !== 'code'
    ) {
      // return { success: false, message: 'Voucher không hợp lệ hoặc đã hết hạn' };
      throw new Error('Voucher không hợp lệ hoặc đã hết hạn');
    }
    return voucher;
  }
}

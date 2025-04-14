import { IVoucher, createVoucher } from '../dto/vocher.dto'; // Ensure you have created the file voucher.dto.ts with interface IVoucher and CreateVoucherDto
import { VouchersRepository } from '../repository/voucher.repository'; // Ensure you have created the file vouchers.repository.ts with the repository for vouchers
export class VouchersService {
  private vouchersRepository = new VouchersRepository();
  // Get all vouchers
  async getAllVouchers(): Promise<IVoucher[]> {
    return this.vouchersRepository.getAllVouchers();
  }
  // Create a new voucher
  async createVoucher(voucherData: Partial<createVoucher>): Promise<IVoucher> {
    return await this.vouchersRepository.createVoucher(voucherData);
  }
  // Get a voucher by ID
  async getVoucherById(id: string): Promise<IVoucher | null> {
    const voucher = await this.vouchersRepository.getVoucherById(id);
    if (!voucher) {
      throw new Error('Voucher not found'); // Updated the error message
    }
    return voucher;
  }
  // Delete a voucher by ID
  async deleteVoucherById(id: string): Promise<IVoucher | null> {
    const voucher = await this.vouchersRepository.deleteVoucherById(id);
    if (!voucher) {
      throw new Error('Voucher not found');
    }
    return voucher;
  }
  // Update a voucher by ID
  async updateVoucherById(
    id: string,
    dataVoucher: Partial<IVoucher>,
  ): Promise<IVoucher | null> {
    const voucher = await this.vouchersRepository.updateVoucherById(
      id,
      dataVoucher,
    );
    if (!voucher) {
      throw new Error('Voucher not found');
    }
    return voucher;
  }
}

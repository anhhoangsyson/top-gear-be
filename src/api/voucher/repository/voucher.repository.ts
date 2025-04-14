// import Voucher, { IVoucher } from '../schema/voucher.schema';

// class VoucherRepository {
//   async findVoucherByCode(code: string): Promise<IVoucher | null> {
//     return await Voucher.findOne({ code }).exec();
//   }

//   async updateVoucherUsageCount(code: string): Promise<IVoucher | null> {
//     return await Voucher.findByIdAndUpdate(
//       code,
//       { $inc: { usedCount: 1 } },
//       { new: true },
//     );
//   }
// }
// export default new VoucherRepository();
import { IVoucher, createVoucher } from '../dto/vocher.dto'; // Ensure you have created the file voucher.dto.ts with interface IVoucher and CreateVoucherDto
import { Voucher } from '../schema/voucher.schema'; // Ensure you have created the file voucher.schema.ts with the schema for vouchers
export class VouchersRepository {
  // Get all vouchers
  async getAllVouchers(): Promise<IVoucher[]> {
    return await Voucher.find(); // Retrieve all vouchers
  }
  // Create a new voucher
  async createVoucher(voucherData: Partial<createVoucher>): Promise<IVoucher> {
    const voucher = new Voucher(voucherData);
    return await voucher.save(); // Save the new voucher
  }
  // Get a voucher by ID
  async getVoucherById(id: string): Promise<IVoucher | null> {
    return await Voucher.findById(id); // Retrieve a voucher by its ID
  }
  // Delete a voucher by ID
  async deleteVoucherById(id: string): Promise<IVoucher | null> {
    return await Voucher.findByIdAndDelete(id); // Delete the voucher by its ID
  }
  // Update a voucher by ID
  async updateVoucherById(
    id: string,
    voucherData: Partial<IVoucher>,
  ): Promise<IVoucher | null> {
    return await Voucher.findByIdAndUpdate(id, voucherData, { new: true }); // Update the voucher and return the updated document
  }
}

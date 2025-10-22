export interface IVoucher {
  _id?: string;
  code?: string; // Có thể undefined nếu là voucher auto
  type: 'code' | 'auto'; // Phân biệt loại voucher
  expiredDate: Date;
  pricePercent: number;
  priceOrigin: number;
  status: 'active' | 'inactive';
}

export interface CreateVoucherDto extends Omit<IVoucher, '_id'> {}

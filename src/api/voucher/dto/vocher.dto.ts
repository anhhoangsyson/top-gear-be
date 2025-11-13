export interface IVoucher {
  _id?: string;
  code?: string; // Có thể undefined nếu là voucher auto
  type: 'code' | 'auto'; // Phân biệt loại voucher
  expiredDate: Date;
  pricePercent: number;
  priceOrigin: number;
  minPrice: number; // Giá trị đơn hàng tối thiểu để áp dụng voucher
  maxUsage: number; // Số lần sử dụng tối đa
  currentUsage: number; // Số lần đã sử dụng
  maxDiscountAmount: number; // Số tiền giảm tối đa (cho % discount), 0 = unlimited
  status: 'active' | 'inactive';
}

export interface CreateVoucherDto
  extends Omit<IVoucher, '_id' | 'currentUsage'> {}

export interface IVoucherUsage {
  _id?: string;
  voucherId: string;
  userId: string;
  orderId: string;
  discountAmount: number;
  usedAt: Date;
  status: 'active' | 'refunded'; // refunded khi order cancelled
}

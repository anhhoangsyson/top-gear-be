interface CartItem {
  _id: string;
  quantity: number;
  price: number;
  discountPrice: number;
}
export enum PaymentMethod {
  CASH = 'cash',
  ZALOPAY = 'zalopay',
}
export class CreateOrderDto {
  customerId: string;
  address: string;
  paymentMethod: PaymentMethod;
  voucherCode?: string | null;
  voucherId?: string | null;
  cartItem: CartItem[];
  note?: string;
  constructor(data: {
    customerId: string;
    address: string;
    voucherId?: string | null;
    paymentMethod: string;
    voucherCode?: string | null;
    cartItem: CartItem[];
    note?: string;
  }) {
    this.customerId = data.customerId;
    this.address = data.address;
    this.voucherId = data.voucherId || null;
    this.paymentMethod = data.paymentMethod as PaymentMethod;
    this.voucherCode = data.voucherCode || null;
    this.cartItem = data.cartItem;
    this.note = data.note || '';
  }
}

interface CartItem {
  _id: string;
  quantity: number;
  variantPrice: number;
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
  cartItem: CartItem[];

  constructor(data: {
    customerId: string;
    address: string;
    paymentMethod: string;
    voucherCode?: string | null;
    cartItem: CartItem[];
  }) {
    this.customerId = data.customerId;
    this.address = data.address;
    this.paymentMethod = data.paymentMethod as PaymentMethod;
    this.voucherCode = data.voucherCode || null;
    this.cartItem = data.cartItem;
  }
}

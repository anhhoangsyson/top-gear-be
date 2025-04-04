export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// export interface Order {
//   id: string;
//   userId: string;
//   items: OrderItem[];
//   totalAmount: number;
//   status:
//     | 'pending'
//     | 'processing'
//     | 'shipped'
//     | 'delivered'
//     | 'completed'
//     | 'cancelled';
//   shippingAddress: ShippingAddress;
//   paymentMethod: string;
//   createdAt: string;
// }

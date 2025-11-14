export interface IOrderItem {
  productId: string;
  quantity: number;
  price?: number;
}

export interface IOrder {
  _id: string;
  userId: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled' | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDto {
  userId: string;
  items: IOrderItem[];
  total: number;
}

export interface UpdateOrderDto {
  items?: IOrderItem[];
  total?: number;
  status?: string;
}

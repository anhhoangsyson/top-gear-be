export interface CreateOrderDto {
  amount: number;
  urlCalbackSuccess?: string; // Chỉ cần cho ZaloPay
  dataSave?: string; // Chỉ cần cho ZaloPay
  description: string;
  nameUser: string;
  paymentMethod: 'cash' | 'zalopay';
}

export interface ZaloPayOrder {
  app_id: string;
  app_trans_id: string;
  app_user: string;
  app_time: number;
  item: string;
  embed_data: string;
  amount: number;
  description: string;
  bank_code: string;
  callback_url: string;
  mac?: string;
}

export interface CallbackDto {
  data: string;
  mac: string;
}

import * as CryptoJS from 'crypto-js';
import { zaloPayConfig } from '../config/zalopay/zalopay.config';

export const generateMac = (data: string, key: string): string => {
  return CryptoJS.HmacSHA256(data, key).toString();
};

export const generateTransId = (): string => {
  const moment = require('moment');
  const transID = Math.floor(Math.random() * 1000000);
  return `${moment().format('YYMMDD')}_${transID}`;
};

export const buildOrderData = (order: any): string => {
  return (
    zaloPayConfig.app_id +
    '|' +
    order.app_trans_id +
    '|' +
    order.app_user +
    '|' +
    order.amount +
    '|' +
    order.app_time +
    '|' +
    order.embed_data +
    '|' +
    order.item
  );
};

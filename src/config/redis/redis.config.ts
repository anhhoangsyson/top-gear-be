import dotenv from 'dotenv';
import { Redis } from 'ioredis';

dotenv.config();

let redisClient: Redis | null;
console.log(
  'REDIS_PASSWORD:',
  process.env.REDIS_PASSWORD ? 'Có dữ liệu' : 'Không có dữ liệu',
);

const connectRedis = () => {
  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
      port: process.env.REDIS_PORT
        ? parseInt(process.env.REDIS_PORT)
        : undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
    redisClient.on('connect', () => {
      console.log('ket noi redis thanh cong');
    });
    redisClient.on('error', (err) => {
      console.log(' ket noi Redis that bai roi di ngu di', err);
    });
  }
  return redisClient;
};
export default connectRedis;

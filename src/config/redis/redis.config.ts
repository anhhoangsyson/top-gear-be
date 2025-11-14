import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

let redisClient: Redis | null;
console.log(
  'REDIS_PASSWORD:',
  process.env.REDIS_PASSWORD ? 'Có dữ liệu' : 'Không có dữ liệu',
);

const connectRedis = () => {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      // support full URL (rediss://... or redis://...)
      redisClient = new Redis(redisUrl);
    } else {
      const options: any = {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      };
      // enable TLS when REDIS_TLS is set
      if (
        process.env.REDIS_TLS === 'true' ||
        (process.env.REDIS_URL || '').startsWith('rediss://')
      ) {
        options.tls = {};
      }
      redisClient = new Redis(options);
    }
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

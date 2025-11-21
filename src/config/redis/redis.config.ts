import dotenv from 'dotenv';
import Redis from 'ioredis';

// File này kết nối tới Redis (dùng ioredis). Hỗ trợ cả `REDIS_URL` dạng đầy đủ
// (redis:// hoặc rediss://) hoặc cấu hình host/port/password riêng.
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
      // Hỗ trợ URL đầy đủ, ví dụ rediss://host:port
      redisClient = new Redis(redisUrl);
    } else {
      const options: any = {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        // Một số option để tránh error khi reconnect trong môi trường dev
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      };
      // Kích hoạt TLS nếu môi trường yêu cầu (REDIS_TLS=true hoặc rediss://...)
      if (
        process.env.REDIS_TLS === 'true' ||
        (process.env.REDIS_URL || '').startsWith('rediss://')
      ) {
        options.tls = {};
      }
      redisClient = new Redis(options);
    }
    // Event listener: useful để debug kết nối
    redisClient.on('connect', () => {
      console.log('Kết nối Redis thành công');
    });
    redisClient.on('error', (err) => {
      // Lưu ý: in lỗi rõ ràng để dev/troubleshoot biết lý do
      console.log('Kết nối Redis thất bại:', err);
    });
  }
  return redisClient;
};
export default connectRedis;

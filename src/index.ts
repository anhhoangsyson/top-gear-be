// Entry point của ứng dụng
// - Khởi tạo Express app, đăng ký middleware chung (CORS, body parser, passport)
// - Đăng ký các router của từng feature (users, products, orders, ...)
// - Kết nối database + redis trước khi listen
// Ghi chú ngắn cho người mới:
//  - Nếu muốn debug: chạy `npm run dev` (nếu dự án có script dev) hoặc chạy container Docker.
//  - CORS_ORIGIN/PORT/MONGO_URI/REDIS_* cấu hình qua file `.env`.
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import http, { METHODS } from 'http';
import connectDatabase from './config/database/database.config';
import usersRouter from './api/users/router/users.router';
import connectRedis from './config/redis/redis.config';
import setupSwagger from './config/swagger/swagger.config';
import path = require('path');
import blogsRouter from './api/blog/router/blog.router';
import commentsRouter from './api/comments/router/comments.router';
import likesRouter from './api/like/router/likes.router';
import cartsRouter from './api/carts/router/carts.router';
import cartDetailsRouter from './api/carts_details/router/carts_details.router';
import passport = require('passport');
import authRouter from './api/auth/router/auth.router';
import orderRouter from './api/order/router/order.router';
import attributeRouter from './api/attribute/router/attribute.router';
import productRouter from './api/product/router/product.router';
import locationRouter from './api/location/route/location.router';
import vouchersRouter from './api/voucher/router/voucher.router';
import brandRoute from './api/brand/router/brand.router';
import notificationRouter from './api/notification/router/notification.router';
import ratingRouter from './api/rating/router/rating.router';
import wishlistRouter from './api/wishlist/router/wishlist.router';
const cors = require('cors');
dotenv.config();
import './config/passport/passport.config';
import errorHandler from './middlewares/errorHandle';
import categoryRouter from './api/category/router/category.router';
import laptopRouter from './api/laptop/router/laptop.router';
import laptopGroupRouter from './api/laptop-group/router/laptop-group.router';
import dashboardRouter from './api/dashboard/dashboard.router';
import jwt from 'jsonwebtoken';
import socketService from './services/socket/socket.service';

const app = express();
const server = http.createServer(app);
// CORS: cho phép origin từ danh sách cấu hình
// Lưu ý: nếu frontend gọi gặp lỗi CORS, kiểm tra `process.env.CORS_ORIGIN` và giá trị header `Origin` trên trình duyệt
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.CORS_ORIGIN || 'http://localhost:3001',
      'https://e-com-two-psi.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: 'Content-Type,Authorization',
  }),
);

const PORT = Number(process.env.PORT) || 3000;
// Body parsers: cho phép đọc JSON và form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);
// View engine: dùng ejs cho các view nhỏ (swagger UI hoặc render trang nếu cần)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
// Passport initialize: nếu dự án dùng passport strategies (OAuth/local)
app.use(passport.initialize());

// Initialize Socket.io
socketService.initialize(server);
// Root route: giữ đơn giản, dev có thể thay bằng health check
app.get('/', (req: Request, res: Response) => {
  res.send('Backend — runninggigigigigigigigigig');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/blog', blogsRouter);
app.use('/api/v1/comments', commentsRouter);
app.use('/api/v1/likes', likesRouter);
app.use('/api/v1/carts', cartsRouter);
app.use('/api/v1/cart-details', cartDetailsRouter);
app.use('/api/v1/attribute', attributeRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/location', locationRouter);
app.use('/api/v1/voucher', vouchersRouter);
app.use('/api/v1/brand', brandRoute);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/laptop', laptopRouter);
app.use('/api/v1/laptop-group', laptopGroupRouter);
app.use('/api/v1/admin/dashboard', dashboardRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/ratings', ratingRouter);
app.use('/api/v1/wishlist', wishlistRouter);
// Error handler: middleware cuối cùng để bắt và format lỗi trả client
app.use(errorHandler);

const start = async () => {
  try {
    // Kết nối DB trước (có retry), sau đó kết nối Redis, rồi start server
    await connectDatabase();
    connectRedis();
    server.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại port ${PORT}`);
      console.log(`📡 Socket.IO ready for realtime notifications`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();

export default app;

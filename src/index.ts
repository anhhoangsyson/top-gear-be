import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import connectDatabase from './config/database/database.config';
import usersRouter from './api/users/router/users.router';
import menusRouter from './api/menus/router/menus.router';
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
import productVariantsRouter from './api/productVariants/router/productVariants.router';
import productImageRouter from './api/produductImage/router/productImage.router';
import locationRouter from './api/location/route/location.router';
import vouchersRouter from './api/voucher/router/voucher.router';
import brandRoute from './api/brand/router/brand.router';
import notificationRouter from './api/notification/router/notification.router';
const cors = require('cors');
dotenv.config();
import './config/passport/passport.config';
import productAttributesRouter from './api/productAttibutes/router/productAttribute.router';
import errorHandler from './middlewares/errorHandle';
import categoryRouter from './api/category/router/category.router';
import laptopRouter from './api/laptop/router/laptop.router';
import laptopGroupRouter from './api/laptop-group/router/laptop-group.router';
import dashboardRouter from './api/dashboard/dashboard.router';
import jwt from 'jsonwebtoken';
import socketService from './services/socket/socket.service';

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3001'],
    allowedHeaders: 'Content-Type,Authorization',
  }),
);

const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(passport.initialize());
connectDatabase();
connectRedis();

// Initialize Socket.io
socketService.initialize(server);
app.get('/', (req: Request, res: Response) => {
  res.send('taideptrai1901');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/menus', menusRouter);
app.use('/api/v1/blog', blogsRouter);
app.use('/api/v1/comments', commentsRouter);
app.use('/api/v1/likes', likesRouter);
app.use('/api/v1/carts', cartsRouter);
app.use('/api/v1/cart-details', cartDetailsRouter);
app.use('/api/v1/attribute', attributeRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/pvariants', productVariantsRouter);
app.use('/api/v1/pattributes', productAttributesRouter);
app.use('/api/v1/pimages', productImageRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/location', locationRouter);
app.use('/api/v1/voucher', vouchersRouter);
app.use('/api/v1/brand', brandRoute);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/laptop', laptopRouter);
app.use('/api/v1/laptop-group', laptopGroupRouter);
app.use('/api/v1/admin/dashboard', dashboardRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
  console.log(`📡 Socket.IO ready for realtime notifications`);
});

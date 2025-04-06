import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDatabase from './config/database/database.config';
import usersRouter from './api/users/router/users.router';
import menusRouter from './api/menus/router/menus.router';
import categoriesRouter from './api/categories/router/categories.router';
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
const cors = require('cors');

dotenv.config();
import './config/passport/passport.config';
import productAttributesRouter from './api/productAttibutes/router/productAttribute.router';

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
    allowedHeaders: 'Content-Type,Authorization',
  }),
);
const PORT = 3000;
app.use(express.json());
setupSwagger(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(passport.initialize());
connectDatabase();
connectRedis();
app.get('/', (req: Request, res: Response) => {
  res.send('taideptrai1901');
});

app.use('/api/v1/auth', authRouter), app.use('/api/v1/users', usersRouter);
app.use('/api/v1/menus', menusRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/blogs', blogsRouter);
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
app.listen(PORT, () => {
  console.log(`Server đang chạy ${PORT}`);
});

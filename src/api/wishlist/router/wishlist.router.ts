import { Router } from 'express';
import { WishlistController } from '../controller/wishlist.controller';
import authenticateJWT from '../../../middlewares/authenticate/authenticateJWT';

const wishlistRouter = Router();
const wishlistController = new WishlistController();

// All routes require authentication
wishlistRouter.post(
  '/',
  authenticateJWT,
  wishlistController.addToWishlist.bind(wishlistController),
);

wishlistRouter.delete(
  '/:laptopId',
  authenticateJWT,
  wishlistController.removeFromWishlist.bind(wishlistController),
);

wishlistRouter.get(
  '/',
  authenticateJWT,
  wishlistController.getWishlist.bind(wishlistController),
);

wishlistRouter.get(
  '/check/:laptopId',
  authenticateJWT,
  wishlistController.checkInWishlist.bind(wishlistController),
);

wishlistRouter.get(
  '/count',
  authenticateJWT,
  wishlistController.getWishlistCount.bind(wishlistController),
);

export default wishlistRouter;

import express from 'express';
import ratingController from '../controller/rating.controller';
import authenticateJWT from '../../../middlewares/authenticate/authenticateJWT';
import checkAdmin from '../../../middlewares/authenticate/checkAdmin';

const router = express.Router();

// Create rating (requires authentication)
router.post(
  '/',
  authenticateJWT,
  ratingController.createRating.bind(ratingController),
);

// Update rating (requires authentication)
router.patch(
  '/:id',
  authenticateJWT,
  ratingController.updateRating.bind(ratingController),
);

// Delete rating (requires authentication)
router.delete(
  '/:id',
  authenticateJWT,
  ratingController.deleteRating.bind(ratingController),
);

// Get ratings by order (public)
router.get(
  '/order/:orderId',
  ratingController.getRatingsByOrder.bind(ratingController),
);

// Get ratings by laptop (public)
router.get(
  '/laptop/:laptopId',
  ratingController.getRatingsByLaptop.bind(ratingController),
);

// Get ratings by current user (requires authentication)
router.get(
  '/user/my-ratings',
  authenticateJWT,
  ratingController.getRatingsByUser.bind(ratingController),
);

// Get rating by ID (public)
router.get('/:id', ratingController.getRatingById.bind(ratingController));

// Get laptop rating stats (public)
router.get(
  '/laptop/:laptopId/stats',
  ratingController.getLaptopRatingStats.bind(ratingController),
);

// ========== ADMIN ROUTES ==========
// Get all ratings with filters (Admin only)
router.get(
  '/admin/all',
  authenticateJWT,
  checkAdmin,
  ratingController.getAllRatings.bind(ratingController),
);

// Get overall rating stats (Admin only)
router.get(
  '/admin/stats',
  authenticateJWT,
  checkAdmin,
  ratingController.getOverallStats.bind(ratingController),
);

// Delete rating by admin (Admin only)
router.delete(
  '/admin/:id',
  authenticateJWT,
  checkAdmin,
  ratingController.deleteRatingByAdmin.bind(ratingController),
);

export default router;

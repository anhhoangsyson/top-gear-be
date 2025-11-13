import { Router } from 'express';
import { CommentsController } from '../controller/comments.controller';
import authenticateJWT from '../../../middlewares/authenticate/authenticateJWT';
import checkAdmin from '../../../middlewares/authenticate/checkAdmin';

const commentsRouter = Router();
const commentsController = new CommentsController();

// Public routes
commentsRouter.get(
  '/',
  commentsController.getAllComments.bind(commentsController),
);
commentsRouter.get(
  '/:id',
  commentsController.getCommentById.bind(commentsController),
);

// Blog comments (public)
commentsRouter.get(
  '/blog/:blogId',
  commentsController.getCommentsByBlog.bind(commentsController),
);

// Authenticated routes
commentsRouter.post(
  '/',
  authenticateJWT,
  commentsController.createComment.bind(commentsController),
);

commentsRouter.patch(
  '/:id',
  authenticateJWT,
  commentsController.updateCommentById.bind(commentsController),
);

commentsRouter.delete(
  '/:id',
  authenticateJWT,
  commentsController.deleteCommentById.bind(commentsController),
);

// User's own comments
commentsRouter.get(
  '/user/my-comments',
  authenticateJWT,
  commentsController.getCommentsByUser.bind(commentsController),
);

// ========== ADMIN ROUTES ==========
// Get all comments with filters (Admin only)
commentsRouter.get(
  '/admin/all',
  authenticateJWT,
  checkAdmin,
  commentsController.getAllCommentsWithFilters.bind(commentsController),
);

// Approve comment (Admin only)
commentsRouter.patch(
  '/admin/:id/approve',
  authenticateJWT,
  checkAdmin,
  commentsController.approveComment.bind(commentsController),
);

// Reject comment (Admin only)
commentsRouter.patch(
  '/admin/:id/reject',
  authenticateJWT,
  checkAdmin,
  commentsController.rejectComment.bind(commentsController),
);

// Get comment stats (Admin only)
commentsRouter.get(
  '/admin/stats',
  authenticateJWT,
  checkAdmin,
  commentsController.getCommentStats.bind(commentsController),
);

export default commentsRouter;

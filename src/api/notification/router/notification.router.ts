import { Router } from 'express';
import notificationController from '../controller/notification.controller';
import authenticateJWT from '../../../middlewares/authenticate/authenticateJWT';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management APIs
 */

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [order, comment, like, system, product, promotion]
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 */
router.get('/', authenticateJWT, notificationController.getNotifications);

/**
 * @swagger
 * /api/v1/notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 */
router.get(
  '/unread-count',
  authenticateJWT,
  notificationController.getUnreadCount,
);

/**
 * @swagger
 * /api/v1/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.patch('/:id/read', authenticateJWT, notificationController.markAsRead);

/**
 * @swagger
 * /api/v1/notifications/mark-all-read:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.patch(
  '/mark-all-read',
  authenticateJWT,
  notificationController.markAllAsRead,
);

/**
 * @swagger
 * /api/v1/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 */
router.delete(
  '/:id',
  authenticateJWT,
  notificationController.deleteNotification,
);

/**
 * @swagger
 * /api/v1/notifications:
 *   delete:
 *     summary: Delete all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications deleted successfully
 */
router.delete(
  '/',
  authenticateJWT,
  notificationController.deleteAllNotifications,
);

/**
 * @swagger
 * /api/v1/notifications:
 *   post:
 *     summary: Create notification (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [order, comment, like, system, product, promotion]
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               data:
 *                 type: object
 *               link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created successfully
 */
router.post('/', authenticateJWT, notificationController.createNotification);

export default router;

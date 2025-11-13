import { Request, Response, NextFunction } from 'express';
import { CommentsService } from '../service/comments.service';
import {
  createCommentSchema,
  updateCommentSchema,
  queryCommentSchema,
} from '../dto/comments.dto';
import { roleUsers } from '../../../constants/users/role/role_users.constants';

const commentsService = new CommentsService();

export class CommentsController {
  async getAllComments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const comments = await commentsService.getAllComments();
      res.status(200).json({
        success: true,
        data: comments,
        length: comments.length,
        message: 'Lấy tất cả bình luận thành công',
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createComment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const validatedData = createCommentSchema.parse(req.body);
      const comment = await commentsService.createComment(
        validatedData,
        userId,
      );

      res.status(201).json({
        success: true,
        data: comment,
        message: 'Tạo bình luận thành công',
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      if (
        error.message.includes('không tồn tại') ||
        error.message.includes('thuộc cùng')
      ) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async getCommentById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const comment = await commentsService.getCommentById(id);
      if (!comment) {
        res.status(404).json({
          success: false,
          message: 'Bình luận không tìm thấy',
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: comment,
        message: 'Lấy bình luận theo ID thành công',
      });
    } catch (error: any) {
      if (error.message.includes('không tìm thấy')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  async deleteCommentById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const isAdmin =
        req.user?.role === roleUsers.ADMIN ||
        req.user?.role === roleUsers.MANAGER;

      const comment = await commentsService.deleteCommentById(
        id,
        userId,
        isAdmin,
      );

      res.status(200).json({
        success: true,
        data: comment,
        message: 'Xóa bình luận thành công',
      });
    } catch (error: any) {
      if (
        error.message.includes('không tìm thấy') ||
        error.message.includes('không có quyền')
      ) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  async updateCommentById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const validatedData = updateCommentSchema.parse(req.body);
      const isAdmin =
        req.user?.role === roleUsers.ADMIN ||
        req.user?.role === roleUsers.MANAGER;

      const comment = await commentsService.updateCommentById(
        id,
        validatedData,
        userId,
        isAdmin,
      );

      if (!comment) {
        res.status(404).json({
          success: false,
          message: 'Bình luận không tìm thấy',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: comment,
        message: 'Cập nhật bình luận thành công',
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      if (
        error.message.includes('không tìm thấy') ||
        error.message.includes('không có quyền')
      ) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  // Blog comments methods
  async getCommentsByBlog(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { blogId } = req.params;
      const query = queryCommentSchema.parse(req.query);
      const includeReplies = req.query.includeReplies !== 'false';

      const result = await commentsService.getCommentsByBlog(
        blogId,
        query.page || 1,
        query.limit || 20,
        includeReplies as boolean,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      if (error.message.includes('không tồn tại')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async getCommentsByUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const query = queryCommentSchema.parse(req.query);
      const result = await commentsService.getCommentsByUser(
        userId,
        query.page || 1,
        query.limit || 20,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      next(error);
    }
  }

  // Admin methods
  async getAllCommentsWithFilters(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query = queryCommentSchema.parse(req.query);
      const filters: any = {};

      if (req.query.blog_id) {
        filters.blog_id = req.query.blog_id as string;
      }
      if (req.query.user_id) {
        filters.user_id = req.query.user_id as string;
      }
      if (req.query.isApproved !== undefined) {
        filters.isApproved = req.query.isApproved === 'true';
      }
      if (req.query.search) {
        filters.search = req.query.search as string;
      }

      const result = await commentsService.getAllCommentsWithFilters(
        filters,
        query.page || 1,
        query.limit || 20,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors,
        });
        return;
      }

      next(error);
    }
  }

  async approveComment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const comment = await commentsService.approveComment(id);

      res.status(200).json({
        success: true,
        data: comment,
        message: 'Duyệt bình luận thành công',
      });
    } catch (error: any) {
      if (error.message.includes('không tồn tại')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async rejectComment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const comment = await commentsService.rejectComment(id);

      res.status(200).json({
        success: true,
        data: comment,
        message: 'Từ chối bình luận thành công',
      });
    } catch (error: any) {
      if (error.message.includes('không tồn tại')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async getCommentStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const stats = await commentsService.getCommentStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

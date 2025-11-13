import {
  IComments,
  CreateComments,
  CreateCommentDto,
  UpdateCommentDto,
} from '../dto/comments.dto';
import { CommentsRepository } from '../repository/comments.repository';
import mongoose from 'mongoose';
import { Blog } from '../../blog/schema/blog.schema';
import notificationService from '../../notification/service/notification.service';
import { Users } from '../../users/schema/user.schema';

export class CommentsService {
  private commentsRepository = new CommentsRepository();

  async getAllComments(): Promise<IComments[]> {
    return this.commentsRepository.getAllComments();
  }

  async createComment(
    commentData: CreateCommentDto,
    userId: string,
  ): Promise<IComments> {
    // Validate blog exists (nếu có blog_id)
    let blog = null;
    if (commentData.blog_id) {
      blog = await Blog.findById(commentData.blog_id);
      if (!blog) {
        throw new Error('Blog không tồn tại');
      }
    }

    // Validate parent comment exists (nếu có parent_id)
    if (commentData.parent_id) {
      // Get parent comment without populate để dễ so sánh blog_id
      const parentComment =
        await this.commentsRepository.getCommentByIdWithoutPopulate(
          commentData.parent_id,
        );
      if (!parentComment) {
        throw new Error('Comment cha không tồn tại');
      }

      // Ensure parent comment belongs to same blog
      const parentBlogId = parentComment.blog_id?.toString();

      if (parentBlogId !== commentData.blog_id) {
        throw new Error('Comment cha phải thuộc cùng blog');
      }
    }

    const comment: Partial<CreateComments> = {
      name: commentData.name,
      content: commentData.content,
      images: commentData.images,
      blog_id: new mongoose.Types.ObjectId(commentData.blog_id) as any,
      user_id: new mongoose.Types.ObjectId(userId) as any,
      parent_id: commentData.parent_id
        ? (new mongoose.Types.ObjectId(commentData.parent_id) as any)
        : null,
      isApproved: true, // Auto-approve for now, admin can reject later
    };

    const createdComment = await this.commentsRepository.createComment(comment);

    // ✅ Send notifications
    try {
      // 1. Notify blog owner (if not the commenter)
      if (blog && blog.userId && blog.userId.toString() !== userId) {
        const commenter = await Users.findById(userId);
        const commenterName =
          commenter?.fullname || commentData.name || 'Người dùng';

        await notificationService.createNotification({
          userId: blog.userId.toString(),
          type: 'comment',
          title: '💬 Bình luận mới',
          message: `${commenterName} đã bình luận bài viết "${blog.title}" của bạn`,
          data: {
            blogId: commentData.blog_id,
            commentId: (createdComment as any)._id.toString(),
            commenterName,
          },
          link: `/blog/${blog.slug || commentData.blog_id}#comment-${(createdComment as any)._id}`,
        });
      }

      // 2. Notify parent comment owner (if replying)
      if (commentData.parent_id) {
        const parentComment = await this.commentsRepository.getCommentById(
          commentData.parent_id,
        );
        if (parentComment && parentComment.user_id) {
          const parentUserId =
            (parentComment.user_id as any)?._id?.toString() ||
            parentComment.user_id.toString();
          if (parentUserId !== userId) {
            const commenter = await Users.findById(userId);
            const commenterName =
              commenter?.fullname || commentData.name || 'Người dùng';

            await notificationService.createNotification({
              userId: parentUserId,
              type: 'comment',
              title: '💬 Phản hồi mới',
              message: `${commenterName} đã phản hồi bình luận của bạn`,
              data: {
                blogId: commentData.blog_id,
                commentId: (createdComment as any)._id.toString(),
                parentCommentId: commentData.parent_id,
                commenterName,
              },
              link: `/blog/${blog?.slug || commentData.blog_id}#comment-${commentData.parent_id}`,
            });
          }
        }
      }

      // 3. Notify admin (for moderation)
      const adminUsers = await Users.find({
        role: { $in: ['admin', 'manager'] },
      });
      if (adminUsers.length > 0 && blog) {
        const commenter = await Users.findById(userId);
        const commenterName =
          commenter?.fullname || commentData.name || 'Người dùng';

        const adminNotifications = adminUsers.map((admin) => ({
          userId: admin._id.toString(),
          type: 'comment' as const,
          title: '📝 Bình luận mới cần duyệt',
          message: `${commenterName} đã bình luận bài viết "${blog.title}"`,
          data: {
            blogId: commentData.blog_id,
            commentId: (createdComment as any)._id.toString(),
            commenterName,
            blogTitle: blog.title,
          },
          link: `/admin/comments/${(createdComment as any)._id}`,
        }));

        await notificationService.createBulkNotifications(adminNotifications);
      }
    } catch (error) {
      console.error('Failed to send comment notifications:', error);
      // Don't throw error, just log it
    }

    return createdComment;
  }

  async getCommentById(id: string): Promise<IComments | null> {
    const comment = await this.commentsRepository.getCommentById(id);
    if (!comment) {
      throw new Error('Bình luận không tìm thấy');
    }
    return comment;
  }

  async deleteCommentById(
    id: string,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<IComments | null> {
    // Get comment without populate để so sánh user_id chính xác
    const comment =
      await this.commentsRepository.getCommentByIdWithoutPopulate(id);
    if (!comment) {
      throw new Error('Bình luận không tìm thấy');
    }

    // Check permission: user can only delete their own comments, admin can delete any
    const commentUserId = comment.user_id?.toString();
    if (!isAdmin && commentUserId !== userId) {
      throw new Error('Bạn không có quyền xóa bình luận này');
    }

    return await this.commentsRepository.deleteCommentById(id);
  }

  async updateCommentById(
    id: string,
    dataComments: UpdateCommentDto,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<IComments | null> {
    // Get comment without populate để so sánh user_id chính xác
    const comment =
      await this.commentsRepository.getCommentByIdWithoutPopulate(id);
    if (!comment) {
      throw new Error('Bình luận không tìm thấy');
    }

    // Check permission: user can only update their own comments, admin can update any
    const commentUserId = comment.user_id?.toString();
    if (!isAdmin && commentUserId !== userId) {
      throw new Error('Bạn không có quyền cập nhật bình luận này');
    }

    // Regular users can't change isApproved
    if (!isAdmin && dataComments.isApproved !== undefined) {
      delete dataComments.isApproved;
    }

    return await this.commentsRepository.updateCommentById(id, dataComments);
  }

  // Blog comments methods
  async getCommentsByBlog(
    blogId: string,
    page: number = 1,
    limit: number = 20,
    includeReplies: boolean = true,
  ) {
    // Validate blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error('Blog không tồn tại');
    }

    return await this.commentsRepository.getCommentsByBlog(
      blogId,
      page,
      limit,
      includeReplies,
    );
  }

  async getCommentsByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return await this.commentsRepository.getCommentsByUser(userId, page, limit);
  }

  // Admin methods
  async getAllCommentsWithFilters(
    filters: {
      blog_id?: string;
      user_id?: string;
      isApproved?: boolean;
      search?: string;
    },
    page: number = 1,
    limit: number = 20,
  ) {
    return await this.commentsRepository.getAllCommentsWithFilters(
      filters,
      page,
      limit,
    );
  }

  async approveComment(id: string): Promise<IComments | null> {
    const comment = await this.commentsRepository.getCommentById(id);
    if (!comment) {
      throw new Error('Bình luận không tồn tại');
    }

    return await this.commentsRepository.approveComment(id);
  }

  async rejectComment(id: string): Promise<IComments | null> {
    const comment = await this.commentsRepository.getCommentById(id);
    if (!comment) {
      throw new Error('Bình luận không tồn tại');
    }

    return await this.commentsRepository.rejectComment(id);
  }

  async getCommentStats() {
    return await this.commentsRepository.getCommentStats();
  }
}

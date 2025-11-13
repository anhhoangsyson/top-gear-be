import { IComments, CreateComments } from '../dto/comments.dto';
import Comments from '../schema/comments.schema';
import mongoose from 'mongoose';

export class CommentsRepository {
  async getAllComments(): Promise<IComments[]> {
    return await Comments.find()
      .populate('blog_id')
      .populate('user_id', 'fullname email avatar')
      .populate('parent_id')
      .sort({ createdAt: -1 });
  }

  async createComment(
    commentData: Partial<CreateComments>,
  ): Promise<IComments> {
    const comment = new Comments(commentData);
    return await comment.save();
  }

  async getCommentById(id: string): Promise<IComments | null> {
    return await Comments.findById(id)
      .populate('blog_id')
      .populate('user_id', 'fullname email avatar')
      .populate('parent_id');
  }

  async getCommentByIdWithoutPopulate(id: string): Promise<IComments | null> {
    return await Comments.findById(id).lean();
  }

  async deleteCommentById(id: string): Promise<IComments | null> {
    return await Comments.findByIdAndDelete(id);
  }

  async updateCommentById(
    id: string,
    dataComments: Partial<IComments>,
  ): Promise<IComments | null> {
    return await Comments.findByIdAndUpdate(id, dataComments, { new: true })
      .populate('blog_id')
      .populate('user_id', 'fullname email avatar')
      .populate('parent_id');
  }

  // Blog comments methods
  async getCommentsByBlog(
    blogId: string,
    page: number = 1,
    limit: number = 20,
    includeReplies: boolean = true,
  ): Promise<{
    comments: IComments[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const query: any = {
      blog_id: new mongoose.Types.ObjectId(blogId),
      isApproved: true,
    };

    // Nếu không include replies, chỉ lấy top-level comments
    if (!includeReplies) {
      query.parent_id = null;
    }

    const [comments, total] = await Promise.all([
      Comments.find(query)
        .populate('user_id', 'fullname email avatar')
        .populate('parent_id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comments.countDocuments(query),
    ]);

    // Nếu include replies, populate replies cho mỗi comment (hỗ trợ multi-level nesting)
    if (includeReplies) {
      // Lấy tất cả replies (cả level 1 và nested)
      const allCommentIds = comments.map((c) => c._id);
      let allReplies = await Comments.find({
        blog_id: new mongoose.Types.ObjectId(blogId),
        isApproved: true,
        parent_id: { $ne: null }, // Chỉ lấy replies (có parent_id)
      })
        .populate('user_id', 'fullname email avatar')
        .populate('parent_id', '_id name')
        .sort({ createdAt: 1 })
        .lean();

      // Helper function để build nested structure
      const buildNestedReplies = (parentId: mongoose.Types.ObjectId): any[] => {
        const children = allReplies.filter((reply: any) => {
          // Handle both populated and non-populated parent_id
          const replyParentId =
            (reply.parent_id as any)?._id?.toString() ||
            reply.parent_id?.toString();
          return replyParentId === parentId.toString();
        });

        return children.map((reply: any) => ({
          ...reply,
          replies: buildNestedReplies(reply._id), // Recursive để lấy nested replies
        }));
      };

      // Attach replies to top-level comments
      comments.forEach((comment) => {
        (comment as any).replies = buildNestedReplies(comment._id);
      });
    }

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCommentsByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    comments: IComments[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comments.find({ user_id: new mongoose.Types.ObjectId(userId) })
        .populate('blog_id', 'title slug')
        .populate('menu_id')
        .populate('parent_id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comments.countDocuments({ user_id: new mongoose.Types.ObjectId(userId) }),
    ]);

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
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
  ): Promise<{
    comments: IComments[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters.blog_id) {
      query.blog_id = new mongoose.Types.ObjectId(filters.blog_id);
    }

    if (filters.user_id) {
      query.user_id = new mongoose.Types.ObjectId(filters.user_id);
    }

    if (filters.isApproved !== undefined) {
      query.isApproved = filters.isApproved;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { content: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const [comments, total] = await Promise.all([
      Comments.find(query)
        .populate('blog_id', 'title slug')
        .populate('user_id', 'fullname email avatar')
        .populate('parent_id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comments.countDocuments(query),
    ]);

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveComment(id: string): Promise<IComments | null> {
    return await Comments.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true },
    )
      .populate('blog_id', 'title slug')
      .populate('user_id', 'fullname email avatar');
  }

  async rejectComment(id: string): Promise<IComments | null> {
    return await Comments.findByIdAndUpdate(
      id,
      { isApproved: false },
      { new: true },
    )
      .populate('blog_id', 'title slug')
      .populate('user_id', 'fullname email avatar');
  }

  async getCommentStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
    byBlog: { blogId: string; count: number }[];
  }> {
    const [total, approved, pending, byBlog] = await Promise.all([
      Comments.countDocuments(),
      Comments.countDocuments({ isApproved: true }),
      Comments.countDocuments({ isApproved: false }),
      Comments.aggregate([
        {
          $match: { blog_id: { $ne: null } },
        },
        {
          $group: {
            _id: '$blog_id',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    return {
      total,
      approved,
      pending,
      byBlog: byBlog.map((item: any) => ({
        blogId: item._id.toString(),
        count: item.count,
      })),
    };
  }
}

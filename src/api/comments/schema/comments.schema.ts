import mongoose, { Document, Schema } from 'mongoose';
import { IComments } from '../dto/comments.dto';

const CommentsSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Mảng các đường dẫn hình ảnh
      default: [],
    },
    blog_id: {
      type: Schema.Types.ObjectId,
      ref: 'blogs', // Tham chiếu đến schema Blog
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: 'Comments', // Tham chiếu đến comment cha (cho reply)
      default: null,
    },
    isApproved: {
      type: Boolean,
      default: true, // Admin có thể approve/reject comments
    },
  },
  { timestamps: true },
);

// Indexes
CommentsSchema.index({ blog_id: 1 });
CommentsSchema.index({ user_id: 1 });
CommentsSchema.index({ parent_id: 1 });
CommentsSchema.index({ isApproved: 1 });

const Comments = mongoose.model<IComments>('Comments', CommentsSchema);

export default Comments;

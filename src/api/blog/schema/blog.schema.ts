import mongoose, { Schema, model } from 'mongoose';
import { Iblog } from '../dto/blog.dto';

const blogSchema = new Schema<Iblog>(
  {
    title: { type: String, required: true }, // Tiêu đề bài viết
    content: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      require: true,
    }, // Nội dung HTML
    tags: { type: [String], default: [] }, // Tags
    thumbnail: { type: String, required: true },
    slug: { type: String, unique: true }, // Ảnh đại diện
  },
  { timestamps: true },
);
// Tự động tạo slug từ title
blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export const Blog = model<Iblog>('blogs', blogSchema);

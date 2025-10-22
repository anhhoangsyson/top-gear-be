import { Iblog, ICreatblog } from '../dto/blog.dto';
import { Blog } from '../schema/blog.schema';

export class BlogiesRepository {
  async getAllBlogs(): Promise<Iblog[]> {
    return await Blog.find();
  }

  async createBlog(blogData: Partial<ICreatblog>): Promise<ICreatblog> {
    const blog = new Blog(blogData);
    // return await Blog.save();
    return await blog.save();
  }

  async getBlogById(id: string): Promise<Iblog | null> {
    return await Blog.findById(id);
  }

  async deleteBlogById(id: string): Promise<Iblog | null> {
    return await Blog.findByIdAndDelete(id);
  }

  async updateBlogById(id: string, datablog: Iblog): Promise<Iblog | null> {
    return await Blog.findByIdAndUpdate(id, datablog, {
      new: true,
    });
  }

  async getBlogBySlug(slug: string): Promise<Iblog> {
    const blog = await Blog.findOne({ slug: slug })
      .populate({ path: 'userId', select: 'fullname' })
      .lean();
    if (!blog) {
      throw new Error('Blog not found');
    }
    return blog;
  }
}

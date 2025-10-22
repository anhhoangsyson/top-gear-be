import { Iblog, ICreatblog } from '../dto/blog.dto';
import { BlogiesRepository } from '../repository/blog.repository';

export class BlogService {
  private c = new BlogiesRepository();

  async getAllBlogs(): Promise<Iblog[]> {
    return this.c.getAllBlogs();
  }

  async createBlog(blogData: Partial<ICreatblog>): Promise<ICreatblog> {
    return await this.c.createBlog(blogData);
  }

  async getBlogById(id: string): Promise<Iblog | null> {
    const blog = await this.c.getBlogById(id);
    if (!blog) {
      throw new Error('Blog not found');
    }
    return blog;
  }

  async deleteBlogById(id: string): Promise<Iblog | null> {
    // Đổi tên phương thức
    const blog = await this.c.deleteBlogById(id); // Sửa tên phương thức gọi tới repository
    if (!blog) {
      throw new Error('Blog not found'); // Đổi thông báo lỗi
    }
    return blog;
  }

  async updateBlogById(
    id: string,
    dataBlog: Iblog, // Đổi tên tham số từ dataCategories thành dataBlog
  ): Promise<Iblog | null> {
    const blog = await this.c.updateBlogById(id, dataBlog); // Sửa tên phương thức gọi tới repository
    if (!blog) {
      throw new Error('Blog not found'); // Đổi thông báo lỗi
    }
    return blog;
  }

  async getBlogBySlug(slug: string): Promise<Iblog> {
    const blog = await this.c.getBlogBySlug(slug);
    if (!blog) {
      throw new Error('Blog not found');
    }
    return blog;
  }
}

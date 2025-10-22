import { NextFunction, Request, Response } from 'express';
import { BlogService } from '../service/blog.service'; // Sửa tên import từ CategoriesService thành BlogService
const blogService = new BlogService(); // Sửa tên biến từ categoriesService thành blogService

export class BlogController {
  async getAllBlogs(req: Request, res: Response): Promise<void> {
    // Đổi tên phương thức
    try {
      const blogs = await blogService.getAllBlogs(); // Sửa tên phương thức gọi tới service
      res.status(200).json({
        data: blogs,
        length: blogs.length,
        message: 'Lấy tất cả blog thành công', // Đổi thông báo
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async createBlog(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    // Đổi tên phương thức
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const userId = user._id;
      const body = req.body;
      const { title, content, thumbnail, tags } = req.body; // Lấy các trường cần thiết từ body

      const blog = await blogService.createBlog({ ...body, userId });
      res.status(201).json({
        data: blog,
        message: 'Tạo blog thành công', // Đổi thông báo
      });
    } catch (error: any) {
      next(error); // Gọi next với lỗi để xử lý ở middleware lỗi
    }
  }

  async getBlogById(req: Request, res: Response): Promise<void> {
    // Đổi tên phương thức
    try {
      const id = req.params.id;
      const blog = await blogService.getBlogById(id); // Sửa tên phương thức gọi tới service
      res.status(200).json({
        data: blog,
        message: 'Lấy blog theo ID thành công', // Đổi thông báo
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async deleteBlogById(req: Request, res: Response): Promise<void> {
    // Đổi tên phương thức
    try {
      const id = req.params.id;
      const blog = await blogService.deleteBlogById(id); // Sửa tên phương thức gọi tới service
      res.status(200).json({
        data: blog,
        message: 'Xóa blog thành công', // Đổi thông báo
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Lỗi máy chủ nội bộ' });
    }
  }

  async updateBlogById(req: Request, res: Response): Promise<void> {
    // Đổi tên phương thức
    try {
      const id = req.params.id;
      const dataBlog = req.body; // Đổi tên biến từ dataCategories thành dataBlog
      const blog = await blogService.updateBlogById(id, dataBlog); // Sửa tên phương thức gọi tới service
      res.status(200).json({
        data: blog,
        message: 'Cập nhật blog thành công', // Đổi thông báo
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Lỗi máy chủ nội bộ' });
    }
  }

  async getBlogBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const blog = await blogService.getBlogBySlug(slug); // Sửa tên phương thức gọi tới service
      if (!blog) {
        res.status(404).json({ message: 'Blog không tồn tại' }); // Đổi thông báo lỗi
        return;
      }
      res.status(200).json({
        data: blog,
        message: 'Lấy blog theo slug thành công', // Đổi thông báo
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Lỗi máy chủ nội bộ' });
    }
  }
}

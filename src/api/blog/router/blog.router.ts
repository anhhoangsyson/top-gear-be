import { Router } from 'express';
import { BlogController } from '../controller/blog.controller'; // Sửa tên import từ MenuController thành BlogController
import authenticateJWT from '../../../middlewares/authenticate/authenticateJWT';

const blogsRouter = Router();
const blogsController = new BlogController(); // Sửa tên biến từ menusController thành blogsController

blogsRouter.get('/slug/:slug', (req, res) => {
  blogsController.getBlogBySlug(req, res); // Sửa tên phương thức từ getAllMenus thành getAllBlogs
});

blogsRouter.get('/', (req, res) => {
  blogsController.getAllBlogs(req, res); // Sửa tên phương thức từ getAllMenus thành getAllBlogs
});

blogsRouter.post('/', authenticateJWT, (req, res, next) => {
  blogsController.createBlog(req, res, next); // Sửa tên phương thức từ createMenus thành createBlog
});

blogsRouter.get('/:id', (req, res) => {
  blogsController.getBlogById(req, res); // Sửa tên phương thức từ getMenusById thành getBlogById
});

blogsRouter.delete('/:id', (req, res) => {
  blogsController.deleteBlogById(req, res); // Sửa tên phương thức từ getMenusById thành deleteBlogById
});

blogsRouter.patch('/:id', (req, res) => {
  blogsController.updateBlogById(req, res); // Sửa tên phương thức từ updataMenusById thành updateBlogById
});

export default blogsRouter;

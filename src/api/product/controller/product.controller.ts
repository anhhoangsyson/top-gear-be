import { Request, Response } from 'express';
import { ProductService } from '../service/product.service';
import {
  CreateProductDto,
  ProductDto,
  UpdateProductDto,
} from '../dto/product.dto';

const productService = new ProductService();

export class ProductController {
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json({
        data: products,
        length: products.length,
        message: 'Lấy tất cả sản phẩm thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      const product = await productService.createProduct(body);
      res.status(201).json({
        data: product,
        message: 'Tạo sản phẩm thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const product = await productService.getProductById(id);
      res.status(200).json({
        data: product,
        message: 'Lấy sản phẩm theo ID thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }

  async updateProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const body = req.body;
      const product = await productService.updateProductById(id, body);
      res.status(200).json({
        data: product,
        message: 'Cập nhật sản phẩm thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }
}

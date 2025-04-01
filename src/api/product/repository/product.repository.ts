import { Product } from '../schema/product.schema';
import {
  CreateProductDto,
  ProductDto,
  UpdateProductDto,
} from '../dto/product.dto';

export class ProductRepository {
  async getAllProducts(): Promise<ProductDto[]> {
    return await Product.find();
  }

  async createProduct(
    productData: CreateProductDto,
  ): Promise<CreateProductDto> {
    const product = new Product(productData);
    return await product.save();
  }

  async getProductById(id: string): Promise<ProductDto | null> {
    return await Product.findById(id);
  }

  async updateProductById(
    id: string,
    dataProduct: UpdateProductDto,
  ): Promise<ProductDto | null> {
    return await Product.findByIdAndUpdate(id, dataProduct, { new: true });
  }

  // async deleteProductById(id: string): Promise<ProductDto | null> {
  //     return await Product.findByIdAndDelete(id);
  // }
}

import { ProductRepository } from '../repository/product.repository';
import {
  CreateProductDto,
  ProductDto,
  UpdateProductDto,
} from '../dto/product.dto';
export class ProductService {
  private p = new ProductRepository();

  async getAllProducts(): Promise<ProductDto[]> {
    return this.p.getAllProducts();
  }

  async createProduct(data: CreateProductDto): Promise<CreateProductDto> {
    return this.p.createProduct(data);
  }

  async getProductById(id: string): Promise<ProductDto | null> {
    return this.p.getProductById(id);
  }

  async updateProductById(
    id: string,
    data: UpdateProductDto,
  ): Promise<ProductDto | null> {
    return this.p.updateProductById(id, data);
  }
}

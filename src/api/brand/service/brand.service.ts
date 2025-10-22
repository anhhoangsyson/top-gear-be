import ApiError from '../../../utilts/apiError';
import { ICreateBrand } from '../dto/brand.dto';
import { BrandRepository } from '../repository/brand.repository';
import { IBrand } from '../schema/brandSchema';

export class BrandService {
  private b = new BrandRepository();

  async createBrand(brandData: ICreateBrand): Promise<IBrand> {
    return await this.b.createBrand(brandData);
  }

  async getAllBrands(): Promise<IBrand[]> {
    const brands = await this.b.getAllBrands();

    if (!brands) {
      throw new ApiError('Không tìm thấy thương hiệu', 404);
    }
    return brands;
  }

  getAllBrandIsActive(): Promise<IBrand[]> {
    return this.b.getAllBrandIsActive();
  }

  async getBrandById(id: string): Promise<IBrand | null> {
    return await this.b.getBrandById(id);
  }

  async updateBrandById(
    id: string,
    brandData: Partial<IBrand>,
  ): Promise<IBrand | null> {
    return await this.b.updateBrandById(id, brandData);
  }

  async inActiveBrand(id: string): Promise<IBrand | null> {
    return await this.b.inActiveBrand(id);
  }

  async activeBrand(id: string): Promise<IBrand | null> {
    return await this.b.activeBrand(id);
  }
}

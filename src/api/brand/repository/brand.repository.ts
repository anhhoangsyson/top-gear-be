import { ICreateBrand } from '../dto/brand.dto';
import Brand, { IBrand } from '../schema/brandSchema';

export class BrandRepository {
  async createBrand(brandData: ICreateBrand): Promise<IBrand> {
    const brand = new Brand(brandData);

    return await brand.save();
  }

  async getAllBrands(): Promise<IBrand[]> {
    return await Brand.find();
  }

  async getAllBrandIsActive(): Promise<IBrand[]> {
    return await Brand.find({ isActive: true });
  }

  async getBrandById(id: string): Promise<IBrand | null> {
    return await Brand.findById(id);
  }

  async updateBrandById(
    id: string,
    brandData: Partial<IBrand>,
  ): Promise<IBrand | null> {
    return await Brand.findByIdAndUpdate(id, brandData, {
      new: true,
    });
  }

  async inActiveBrand(id: string): Promise<IBrand | null> {
    return await Brand.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
  }

  async activeBrand(id: string): Promise<IBrand | null> {
    return await Brand.findByIdAndUpdate(id, { isActive: true }, { new: true });
  }
}

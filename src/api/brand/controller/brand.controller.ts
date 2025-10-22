import { NextFunction, Request, Response } from 'express';
import { IBrand } from '../schema/brandSchema';
import { BrandService } from '../service/brand.service';
import { error } from 'console';
import { body } from 'express-validator';
import { ICreateBrand } from '../dto/brand.dto';

const brandService = new BrandService();

export class BrandController {
  async createBrand(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Vui lòng tải lên hình ảnh' });
      }

      const { name, description, country, website } = req.body;

      const imageUrl = req.file.path;
      console.log('imageUrl', imageUrl);

      const brandData: ICreateBrand = {
        name: name as string,
        description,
        country,
        website,
        logo: imageUrl,
      };

      const brand = await brandService.createBrand(brandData);
      res.status(201).json({
        data: brand,
        message: 'Tạo thương hiệu thành công',
      });
      return brand;
    } catch (error) {
      next(error);
    }
  }

  async getAllBrands(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<IBrand[] | void> {
    try {
      const brands = await brandService.getAllBrands();
      res.status(200).json({
        data: brands,
        length: brands.length,
        message: 'Lấy tất cả thương hiệu thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllBrandIsActive(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await brandService.getAllBrandIsActive();
      res.status(200).json({
        data: brands,
        length: brands.length,
        message: 'Lấy tất cả thương hiệu đang hoạt động thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async getBrandById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const brand = await brandService.getBrandById(id);
      res.status(200).json({
        data: brand,
        message: 'Lấy thương hiệu theo id thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBrandById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const brandData: Partial<IBrand> = req.body;

      const brand = await brandService.updateBrandById(id, brandData);
      res.status(200).json({
        data: brand,
        message: 'Cập nhật thương hiệu thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async inActiveBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const brand = await brandService.inActiveBrand(id);
      res.status(200).json({
        data: brand,
        message: 'Vô hiệu hóa thương hiệu thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async activeBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const brand = await brandService.activeBrand(id);
      res.status(200).json({
        data: brand,
        message: 'Kích hoạt thương hiệu thành công',
      });
    } catch (error) {
      next(error);
    }
  }
}

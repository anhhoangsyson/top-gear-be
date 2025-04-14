import { Request, Response } from 'express';
import { ProductVariantsService } from '../service/productVariant.service';
import { log } from 'util';

export const ProductVariantController = {
  async getAllProductVariants(req: Request, res: Response) {
    try {
      const productVariants =
        await ProductVariantsService.getAllProductVariants();
      res.status(200).json({
        data: productVariants,
        message: 'Lấy tất cả sản phẩm thành công',
        length: productVariants.length,
      });
    } catch (error) {
      res.status(500).json({ message: 'Loi khong sac dinh', error });
    }
  },
  async getProductVariantsByChildId(req: Request, res: Response) {
    try {
      const { childId } = req.params;
      const productVariants =
        await ProductVariantsService.getProductVariantsByChildId(childId);
      res.status(200).json({
        data: productVariants,
        message: 'Lấy tất cả sản phẩm thành công',
        length: productVariants.length,
      });
    } catch (error) {
      res.status(500).json({ message: 'Loi khong sac dinh', error });
    }
  },
  async createProductVariants(req: Request, res: Response) {
    const data = req.body;
    try {
      const productVariant =
        await ProductVariantsService.createProductVariants(data);
      res.status(201).json({
        data: productVariant,
        message: 'Tạo variant cho sản phẩm thành công',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Loi khong sac dinh' });
      }
    }
  },

  async findByProductId(req: Request, res: Response) {
    const { productId } = req.params;
    // console.log('productId', productId);

    try {
      const ProductVariant =
        await ProductVariantsService.findByProductId(productId);
      res.status(200).json(ProductVariant);
    } catch (error) {
      res.status(500).json({ message: 'Loi khong sac dinh', error });
    }
  },

  async findProductVariantById(req: Request, res: Response) {
    const { id } = req.params;
    console.log('productVariantsId', id);
    try {
      const ProductVariant =
        await ProductVariantsService.findProductVariantById(id);
      res.status(200).json(ProductVariant);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ message: 'Loi khong sac dinh', error });
    }
  },

  async findProductVariantsByFilter(req: Request, res: Response) {
    try {
      const { filterData } = req.query;
      console.log('filter', filterData);

      const filterArray = Array.isArray(filterData) ? filterData : [filterData];

      const productVariants =
        await ProductVariantsService.findProductVariantsByFilter(filterArray);

      if (!productVariants || productVariants.length === 0) {
        return res.status(404).json({ message: 'Khong tim thay san pham' });
      }

      res.status(200).json({
        data: productVariants,
        message: 'Lấy tất cả sản phẩm thành công',
        length: productVariants.length,
      });
    } catch (error) {
      res.status(500).json({ message: 'Loi khong sac dinh', error });
    }
  },

  async getProductVariantsByCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ProductVariant =
        await ProductVariantsService.getProductVariantsByCategory(id);
      res.status(200).json(ProductVariant);
    } catch (error) {
      res.status(500).json({ message: 'Loi khong sac dinh', error });
    }
  },

  async updateProductVariantsById(req: Request, res: Response) {
    const { productVariantsId } = req.params;
    const data = req.body;
    try {
      const ProductVariant =
        await ProductVariantsService.updateProductVariantsById(
          productVariantsId,
          data,
        );
      res.status(200).json(ProductVariant);
    } catch (error) {
      res.status(500).json({ message: 'Loi khong sac dinh', error });
    }
  },

  async inActiveProductVariantsById(req: Request, res: Response) {
    const { productVariantsId } = req.params;
    try {
      console.log('productVariantsId', productVariantsId);
      const ProductVariant =
        await ProductVariantsService.inActiveProductVariantsById(
          productVariantsId,
        );
      res.status(200).json(ProductVariant);
    } catch (error) {
      res.status(500).json({ message: 'Loi khong sac dinh', error });
    }
  },

  async activeProductVariantsById(req: Request, res: Response) {
    const { productVariantsId } = req.params;
    try {
      // console.log('productVariantsId', productVariantsId);

      const ProductVariant =
        await ProductVariantsService.activeProductVariantsById(
          productVariantsId,
        );
      console.log('ProductVariant', ProductVariant);

      res.status(200).json(ProductVariant);
    } catch (error) {
      res.status(500).json({ message: 'Loi khong sac dinh', error });
    }
  },

  async getProductVariantsRelated(req: Request, res: Response) {
    try {
      const variantId = req.params.variantId;
      const productVariantsRelated =
        await ProductVariantsService.getProductVariantsRelated(variantId);
      res.status(200).json({
        data: productVariantsRelated,
        message: 'Lấy tất cả sản phẩm liên quan thành công',
        length: productVariantsRelated.length,
      });
    } catch (error) {
      res.status(500).json({ message: 'Loi khong sac dinh', error });
    }
  },
};

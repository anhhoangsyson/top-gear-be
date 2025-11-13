import { Request, Response } from 'express';
import { ProductVariantsService } from '../service/productVariant.service';

export const ProductVariantController = {
  async getAllProductVariants(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      const skip = (page - 1) * limit;

      const { productVariants, total } =
        await ProductVariantsService.getAllProductVariants({ skip, limit });
      res.status(200).json({
        data: productVariants,
        page,
        limit,
        total,
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

  // Search products with full-text search
  async searchProducts(req: Request, res: Response) {
    try {
      const keyword = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      // Parse filters from query params
      const filters: any = {};
      if (req.query.minPrice) {
        filters.minPrice = parseFloat(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        filters.maxPrice = parseFloat(req.query.maxPrice as string);
      }
      if (req.query.categories) {
        filters.categories = Array.isArray(req.query.categories)
          ? req.query.categories
          : [req.query.categories];
      }
      if (req.query.status) {
        filters.status = req.query.status as string;
      }

      const result = await ProductVariantsService.searchProducts(
        keyword,
        page,
        limit,
        Object.keys(filters).length > 0 ? filters : undefined,
      );

      res.status(200).json({
        success: true,
        message: 'Tìm kiếm sản phẩm thành công',
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res
          .status(500)
          .json({ success: false, message: 'Lỗi không xác định', error });
      }
    }
  },

  // Autocomplete for search suggestions
  async autocompleteProducts(req: Request, res: Response) {
    try {
      const keyword = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 5;

      const result = await ProductVariantsService.autocompleteProducts(
        keyword,
        limit,
      );

      res.status(200).json({
        success: true,
        message: 'Lấy gợi ý tìm kiếm thành công',
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res
          .status(500)
          .json({ success: false, message: 'Lỗi không xác định', error });
      }
    }
  },
};

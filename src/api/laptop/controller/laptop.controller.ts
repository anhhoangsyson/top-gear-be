import { Request, Response, NextFunction } from 'express';
import { LaptopService } from '../service/laptop.service';

export class LaptopController {
  constructor(private readonly laptopService: LaptopService) {}

  async createLaptop(req: Request, res: Response, next: NextFunction) {
    try {
      // Normalize req.files into an array for consistent handling.
      const filesArray: Express.Multer.File[] = (() => {
        if (!req.files) return [];
        if (Array.isArray(req.files)) return req.files as Express.Multer.File[];
        // when using upload.fields(), req.files is Record<string, Express.Multer.File[]>
        const filesObj = req.files as Record<string, Express.Multer.File[]>;
        return Object.values(filesObj).flat();
      })();

      if (filesArray.length === 0) {
        return res.status(400).json({ message: 'Vui lòng tải lên hình ảnh' });
      }

      // parse 'specifications' field safely
      let specifications: any = {};
      if (req.body.specifications) {
        try {
          specifications =
            typeof req.body.specifications === 'string'
              ? JSON.parse(req.body.specifications)
              : req.body.specifications;
        } catch (e) {
          specifications = {};
        }
      }

      // parse tags (may be JSON string or omitted)
      const tags = req.body.tags
        ? typeof req.body.tags === 'string'
          ? JSON.parse(req.body.tags)
          : req.body.tags
        : [
            req.body.name,
            req.body.modelName,
            specifications.processor,
            specifications.ram ? `${specifications.ram}GB RAM` : '',
            specifications.storage ? `${specifications.storage}GB Storage` : '',
          ].filter(Boolean);

      // parse seoMetadata (safe)
      const seoMetadata = req.body.seoMetadata
        ? typeof req.body.seoMetadata === 'string'
          ? JSON.parse(req.body.seoMetadata)
          : req.body.seoMetadata
        : {};

      const slug = req.body.name
        ? String(req.body.name)
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
        : '';

      // parse altText which can be array, json-string or single string
      const altTexts: string[] = (() => {
        const at = req.body?.altText;
        if (!at) return [];
        if (Array.isArray(at)) return at;
        if (typeof at === 'string') {
          try {
            const parsed = JSON.parse(at);
            return Array.isArray(parsed) ? parsed : [String(parsed)];
          } catch {
            return [at];
          }
        }
        return [];
      })();

      const imageUrls = filesArray.map((file, index) => ({
        imageUrl: (file as any).path,
        altText: altTexts[index] || '',
        isPrimary: false,
        sortOrder: index + 1,
      }));

      if (imageUrls.length > 0) imageUrls[0].isPrimary = true;

      const laptopData = {
        ...req.body,
        specifications,
        images: imageUrls,
        tags,
        seoMetadata,
        slug,
      };

      const laptop = await this.laptopService.createLaptop(laptopData);
      res
        .status(201)
        .json({ data: laptop, message: 'Laptop created successfully' });
    } catch (error) {
      // Handle Multer errors clearly
      if ((error as any)?.name === 'MulterError') {
        return res
          .status(400)
          .json({ success: false, error: (error as any).message });
      }
      next(error);
    }
  }

  async getLaptopById(req: Request, res: Response, next: NextFunction) {
    try {
      const laptop = await this.laptopService.getLaptopById(req.params.id);
      if (!laptop) {
        return res.status(404).json({ message: 'Laptop not found' });
      }
      res.status(200).json({ data: laptop });
    } catch (error) {
      next(error);
    }
  }

  async getAllLaptops(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;

      // Validate status parameter
      if (status && status !== 'active' && status !== 'all') {
        return res.status(400).json({
          message: 'Invalid status parameter. Use "active" or "all"',
        });
      }

      const laptops = await this.laptopService.getAllLaptops(
        status as 'active' | 'all' | undefined,
      );
      res.status(200).json({ data: laptops });
    } catch (error) {
      next(error);
    }
  }

  async updateLaptop(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Update laptop ID:', req.params.id);
      console.log('Update data:', JSON.stringify(req.body, null, 2));

      // Parse 'specifications' field if it's a JSON string
      let specifications: any;
      if (req.body.specifications) {
        try {
          specifications =
            typeof req.body.specifications === 'string'
              ? JSON.parse(req.body.specifications)
              : req.body.specifications;
        } catch (e) {
          // If parsing fails, keep the original value
          specifications = req.body.specifications;
        }
      }

      // Parse tags if it's a JSON string
      let tags: any;
      if (req.body.tags) {
        try {
          tags =
            typeof req.body.tags === 'string'
              ? JSON.parse(req.body.tags)
              : req.body.tags;
        } catch (e) {
          tags = req.body.tags;
        }
      }

      // Parse seoMetadata if it's a JSON string
      let seoMetadata: any;
      if (req.body.seoMetadata) {
        try {
          seoMetadata =
            typeof req.body.seoMetadata === 'string'
              ? JSON.parse(req.body.seoMetadata)
              : req.body.seoMetadata;
        } catch (e) {
          seoMetadata = req.body.seoMetadata;
        }
      }

      // Handle new images if provided
      const filesArray: Express.Multer.File[] = (() => {
        if (!req.files) return [];
        if (Array.isArray(req.files)) return req.files as Express.Multer.File[];
        const filesObj = req.files as Record<string, Express.Multer.File[]>;
        return Object.values(filesObj).flat();
      })();

      const updateData: any = {
        ...req.body,
        ...(specifications && { specifications }),
        ...(tags && { tags }),
        ...(seoMetadata && { seoMetadata }),
      };

      // If new images are uploaded, process them
      if (filesArray.length > 0) {
        const altTexts: string[] = (() => {
          const at = req.body?.altText;
          if (!at) return [];
          if (Array.isArray(at)) return at;
          if (typeof at === 'string') {
            try {
              const parsed = JSON.parse(at);
              return Array.isArray(parsed) ? parsed : [String(parsed)];
            } catch {
              return [at];
            }
          }
          return [];
        })();

        const imageUrls = filesArray.map((file, index) => ({
          imageUrl: (file as any).path,
          altText: altTexts[index] || '',
          isPrimary: false,
          sortOrder: index + 1,
        }));

        if (imageUrls.length > 0) imageUrls[0].isPrimary = true;
        updateData.images = imageUrls;
      }

      const laptop = await this.laptopService.updateLaptop(
        req.params.id,
        updateData,
      );

      console.log('Updated laptop:', JSON.stringify(laptop, null, 2));

      if (!laptop) {
        return res.status(404).json({ message: 'Laptop not found' });
      }
      res
        .status(200)
        .json({ data: laptop, message: 'Laptop updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteLaptop(req: Request, res: Response, next: NextFunction) {
    try {
      const laptop = await this.laptopService.deleteLaptop(req.params.id);
      if (!laptop) {
        return res.status(404).json({ message: 'Laptop not found' });
      }
      res
        .status(200)
        .json({ data: laptop, message: 'Laptop deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async suggestMetadata(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, modelName, description, specifications } = req.body;
      console.log('req.body hihi', req.body);

      // Gợi ý seoMetadata
      const seoMetadata = {
        metaTitle: name || '',
        metaDescription: description || '',
        keywords: [name, modelName, specifications?.processor].filter(Boolean),
      };

      // Gợi ý tags
      const tags = [
        name,
        modelName,
        specifications?.processor,
        specifications?.ram ? `${specifications.ram}GB RAM` : '',
        specifications?.storage ? `${specifications.storage}GB Storage` : '',
      ].filter(Boolean);

      res.status(200).json({
        data: {
          seoMetadata,
          tags,
          message: 'Gợi ý metadata thành công',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getLaptopBySlug(req: Request, res: Response, next: NextFunction) {
    const slug = req.params.slug;
    try {
      const laptop = await this.laptopService.getLaptopBySlug(slug);
      if (!laptop) {
        return res.status(404).json({ message: 'Laptop not found' });
      }
      res.status(200).json({ data: laptop });
    } catch (error) {
      next(error);
    }
  }

  async getLaptopRelated(req: Request, res: Response, next: NextFunction) {
    const { brandId, categoryId, excludeId } = req.query;
    try {
      const laptopRelated = await this.laptopService.getLaptopRelated(
        brandId as string,
        categoryId as string,
        excludeId as string,
      );

      if (!laptopRelated || laptopRelated.length === 0) {
        return res.status(404).json({ message: 'No related laptops found' });
      }
      res.status(200).json({ data: laptopRelated });
    } catch (error) {
      next(error);
    }
  }

  async findLaptopsByBrand(req: Request, res: Response, next: NextFunction) {
    const { brandSlug } = req.query;
    const filters = req.query.filters
      ? JSON.parse(req.query.filters as string)
      : {};
    try {
      const laptops = await this.laptopService.findLaptopsByBrand(
        brandSlug as string,
        filters,
      );
      res.status(200).json({
        data: laptops,
        message: 'Laptops by brand successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async findLaptopsByCategory(req: Request, res: Response, next: NextFunction) {
    const { categorySlug } = req.query;
    const filters = req.query.filters
      ? JSON.parse(req.query.filters as string)
      : {};
    try {
      const laptops = await this.laptopService.findLaptopsByCategory(
        categorySlug as string,
        filters,
      );
      res.status(200).json({
        data: laptops,
        message: 'Laptops categoryslug successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async findLaptopsByCategoryAndBrand(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { brandSlug, categorySlug } = req.query;
    console.log('brandSlug', brandSlug);
    console.log('categorySlug', categorySlug);

    const filters = req.query.filters
      ? JSON.parse(req.query.filters as string)
      : {};
    try {
      const laptops = await this.laptopService.findLaptopsByCategoryAndBrand(
        categorySlug as string,
        brandSlug as string,
        filters,
      );
      res.status(200).json({
        data: laptops,
        message: 'Laptops retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async filterLaptops(req: Request, res: Response, next: NextFunction) {
    try {
      const laptops = await this.laptopService.filterLaptops(req.query);
      res.status(200).json({
        data: laptops,
        message: 'Laptops filtered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async setActiveStatus(
    req: Request,
    res: Response,
    next: NextFunction,
    isActive: boolean,
  ) {
    try {
      const { id } = req.params;
      const laptop = await this.laptopService.setActiveStatus(id, isActive);
      if (!laptop) {
        return res.status(404).json({ message: 'Laptop not found' });
      }
      return laptop;
    } catch (error) {
      next(error);
    }
  }

  // Search suggestions - gợi ý sản phẩm khi user đang gõ
  async searchSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, limit } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          message: 'Query parameter "q" is required',
        });
      }

      const suggestions = await this.laptopService.searchSuggestions(
        q,
        limit ? parseInt(limit as string) : undefined,
      );

      res.status(200).json({
        data: suggestions,
        query: q,
        count: suggestions.length,
        message: 'Search suggestions retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Autocomplete - gợi ý từ khóa để hoàn thành câu tìm kiếm
  async autocomplete(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, limit } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          message: 'Query parameter "q" is required',
        });
      }

      const suggestions = await this.laptopService.autocomplete(
        q,
        limit ? parseInt(limit as string) : undefined,
      );

      res.status(200).json({
        data: suggestions,
        query: q,
        count: suggestions.length,
        message: 'Autocomplete suggestions retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Realtime search - tìm kiếm realtime với phân trang và sắp xếp
  async realtimeSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, page, limit, sortBy } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          message: 'Query parameter "q" is required',
        });
      }

      const result = await this.laptopService.realtimeSearch(
        q,
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined,
        sortBy as string,
      );

      res.status(200).json({
        data: result.laptops,
        query: q,
        pagination: {
          page: result.page,
          limit: limit ? parseInt(limit as string) : 20,
          total: result.total,
          totalPages: result.totalPages,
        },
        message: 'Search results retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

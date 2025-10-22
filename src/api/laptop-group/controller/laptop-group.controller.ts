import { Request, Response, NextFunction } from 'express';
import { LaptopGroupService } from '../service/laptop-group.service';
import { ILaptopGroup } from '../schema/laptop-group.schema';
import { ICreateLaptopGroupDto } from '../dto/laptop-group.dto';

const service = new LaptopGroupService();

export class LaptopGroupController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Vui lòng tải lên hình ảnh' });
      }

      const { name, description, sortOrder } = req.body;
      const imgUrl = req.file?.path;
      const laptops = req.body.laptops ? JSON.parse(req.body.laptops) : [];

      const slug = description
        ? description
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : '';

      const laptopGroup: ICreateLaptopGroupDto = {
        name: name as string,
        laptops: laptops || [],
        description: description || '',
        slug: slug || '',
        isActive: true,
        sortOrder: sortOrder || 0,
        backgroundImage: imgUrl || '',
      };

      const group = await service.create(laptopGroup);
      res.status(201).json({ data: group });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const groups = await service.getAll();
      res.json({ data: groups });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await service.getById(req.params.id);
      if (!group) return res.status(404).json({ message: 'Not found' });
      res.json({ data: group });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await service.update(req.params.id, req.body);
      if (!group) return res.status(404).json({ message: 'Not found' });
      res.json({ data: group });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await service.delete(req.params.id);
      if (!group) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

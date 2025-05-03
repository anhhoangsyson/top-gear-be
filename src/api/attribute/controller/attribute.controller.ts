import { Request, Response } from 'express';
import { AttributeService } from '../service/attribute.service';
import { IAttributeDto, IAttributeResponseDto } from '../dto/attribute.dto';

const attibuteService = new AttributeService();

export class AttributeController {
  async getAllAttributes(req: Request, res: Response): Promise<void> {
    try {
      const attributes = await attibuteService.getAllAttributes();
      res.status(200).json({
        data: attributes,
        length: attributes.length,
        message: 'Lấy tất cả thuộc tính thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }

  async createAttribute(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      const attribute = await attibuteService.createAttriute(body);
      res.status(201).json({
        data: attribute,
        message: 'Tạo thuộc tính thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }

  async updateAttributeById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const body = req.body;
      const attribute = await attibuteService.updateAttributeById(id, body);
      res.status(200).json({
        data: attribute,
        message: 'Cập nhật thuộc tính thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }

  async getAttributeById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const attribute = await attibuteService.getAttributeById(id);
      res.status(200).json({
        data: attribute,
        message: 'Lấy thuộc tính theo ID thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }

  async activeAttributeById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const attribute = await attibuteService.activeAttributeById(id);
      res.status(200).json({
        data: attribute,
        message: 'Kích hoạt thuộc tính thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }

  async inActiveAttributeById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const attribute = await attibuteService.inActiveAttributeById(id);
      res.status(200).json({
        data: attribute,
        message: 'Vô hiệu hóa thuộc tính thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }

  async getAttributesByCategoryId(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.params.categoryId;
      const attributes =
        await attibuteService.getAttributesByCategoryId(categoryId);
      res.status(200).json({
        data: attributes,
        message: 'Lấy thuộc tính theo ID danh mục thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error });
    }
  }
}

import { Request, Response } from 'express';

import { ProductAttributeService } from '../service/productAttributes.service';

export class ProductAttributeController {
  private service = new ProductAttributeService();

  async createProductAttributes(req: Request, res: Response) {
    try {
      const body = req.body;
      console.log(body);
      const productAttribute = await this.service.createProductAttributes(body);
      res.status(201).json({
        data: productAttribute,
        message: 'Tạo thuộc tính sản phẩm thành công',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async getProductAttributesByVariantId(req: Request, res: Response) {
    try {
      const { variantId } = req.params;
      const productAttribute =
        await this.service.getProductAttributesByVariantId(variantId);
      res.status(200).json({
        data: productAttribute,
        message: 'Lấy thuộc tính sản phẩm theo ID thành công',
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error,
      });
    }
  }

  async setActiveStatus(req: Request, res: Response): Promise<void> {
    const productAttributeId = req.params.productAttributeId;
    const isActive = req.body.isActive;
    try {
      const productAttribute = await this.service.setActiveStatus(
        productAttributeId,
        isActive,
      );
      res.status(200).json({
        data: productAttribute,
        message: 'Cập nhật trạng thái thành công',
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async updateProductAttributes(req: Request, res: Response) {
    try {
      const productAttributeId = req.params.productAttributeId;
      const body = req.body;
      const productAttribute = await this.service.updateProductAttributes(
        productAttributeId,
        body,
      );
      res.status(200).json({
        data: productAttribute,
        message: 'Cập nhật thuộc tính sản phẩm thành công',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  }
}

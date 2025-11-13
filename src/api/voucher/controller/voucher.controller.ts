import { Request, Response } from 'express';
import { VoucherService } from '../service/voucher.service';

const voucherService = new VoucherService();

export class VoucherController {
  async getAll(req: Request, res: Response) {
    const data = await voucherService.getAll();
    res.json({ data });
  }

  async getById(req: Request, res: Response) {
    const data = await voucherService.getById(req.params.id);
    res.json({ data });
  }

  async create(req: Request, res: Response) {
    const data = await voucherService.create(req.body);
    res.json({ data });
  }

  async update(req: Request, res: Response) {
    const data = await voucherService.update(req.params.id, req.body);
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    const data = await voucherService.delete(req.params.id);
    res.json({ data });
  }

  // Khách hàng lấy voucher khả dụng
  async getAvailable(req: Request, res: Response) {
    const data = await voucherService.getAvailableVouchers();
    res.json({ data });
  }

  // Khách hàng áp dụng voucher code
  async applyCode(req: Request, res: Response) {
    const { code, orderAmount } = req.body;
    console.log(`Applying voucher code: ${code}, orderAmount: ${orderAmount}`);

    try {
      const result = await voucherService.applyVoucherCode(code, orderAmount);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

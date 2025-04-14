import { Request, Response } from 'express';
import { VouchersService } from '../service/voucher.service'; // Ensure you have created the file vouchers.service.ts
const vouchersService = new VouchersService();
export class VoucherController {
  // Get all vouchers
  async getAllVouchers(req: Request, res: Response): Promise<void> {
    try {
      const vouchers = await vouchersService.getAllVouchers();
      res.status(200).json({
        data: vouchers,
        length: vouchers.length,
        message: 'Get all vouchers successfully',
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  // Create a new voucher
  async createVoucher(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      const voucher = await vouchersService.createVoucher(body);
      res.status(201).json({
        data: voucher,
        message: 'Create voucher successfully',
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || 'Internal server error' });
    }
  }
  // Get a voucher by ID
  async getVoucherById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const voucher = await vouchersService.getVoucherById(id);
      if (!voucher) {
        res.status(404).json({ message: 'Voucher not found' });
        return;
      }
      res.status(200).json({
        data: voucher,
        message: 'Get voucher by ID successfully',
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  // Delete a voucher by ID
  async deleteVoucherById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const voucher = await vouchersService.deleteVoucherById(id);
      if (!voucher) {
        res.status(404).json({ message: 'Voucher not found' });
        return;
      }
      res.status(200).json({
        data: voucher,
        message: 'Delete voucher successfully',
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || 'Internal server error' });
    }
  }
  // Update a voucher by ID
  async updateVoucherById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const dataVoucher = req.body;
      const voucher = await vouchersService.updateVoucherById(id, dataVoucher);
      if (!voucher) {
        res.status(404).json({ message: 'Voucher not found' });
        return;
      }
      res.status(200).json({
        data: voucher,
        message: 'Update voucher successfully',
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || 'Internal server error' });
    }
  }
}

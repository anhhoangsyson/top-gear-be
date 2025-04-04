import { Request, Response } from 'express';
import { PaymentService } from '../service/payment.service';
import { CallbackDto } from '../dto/payment.dto';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async handleCallback(req: Request, res: Response) {
    try {
      const dto: CallbackDto = req.body;
      if (!dto.data || !dto.mac) {
        return res.status(400).json({ error: 'Dữ liệu callback không hợp lệ' });
      }
      const result = await this.paymentService.handleCallback(dto);
      console.log('result from callback', result);

      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.json({
        return_code: 0,
        return_message: (error as Error).message,
      });
    }
  }

  async queryTransactionStatus(req: Request, res: Response) {
    try {
      const { app_trans_id } = req.body;
      if (!app_trans_id) {
        return res.status(400).json({ error: 'Thiếu app_trans_id' });
      }
      const result =
        await this.paymentService.queryTransactionStatus(app_trans_id);
      return res.status(200).json({
        data: result,
        message: 'Truy vấn trạng thái giao dịch thành công',
      });
    } catch (error) {
      console.error('Query error:', error);
      return res.status(500).json({
        message: 'Lỗi khi truy vấn trạng thái giao dịch',
        error: (error as Error).message,
      });
    }
  }
}

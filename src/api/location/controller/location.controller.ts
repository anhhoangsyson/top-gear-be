import { Request, Response } from 'express';
import { LocationService } from '../service/location.service';
import { CreateLocationDTO } from '../dto/location.dto';

export class LocationController {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  async getLocationsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user._id; // Giả sử middleware auth đã gắn user vào req
      const locations = await this.locationService.getLocationsByUserId(userId);
      res.status(200).json({
        data: locations,
        status: 200,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi lấy danh sách địa chỉ',
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      });
    }
  }

  async createLocation(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user._id;

      const locationData = new CreateLocationDTO(req.body);
      const newLocation = await this.locationService.createLocation(
        userId,
        locationData,
      );
      res.status(201).json({
        data: newLocation,
        status: 201,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Lỗi khi tạo địa chỉ mới',
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 400,
      });
    }
  }

  async deleteLocation(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await this.locationService.deleteLocation(id);
      res.status(200).json({
        message: 'Xóa địa chỉ thành công',
        status: 200,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi xóa địa chỉ',
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      });
    }
  }

  async setDefaultLocation(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await this.locationService.setDefaultLocation(id);
      res.status(200).json({
        message: 'Đặt địa chỉ mặc định thành công',
        status: 200,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi đặt địa chỉ mặc định',
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      });
    }
  }

  async updateLocation(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (user) {
        const id = req.params.id;
        const locationData = req.body;
        await this.locationService.updateLocation(id, locationData);
        res.status(200).json({
          message: 'Cập nhật địa chỉ thành công',
          status: 200,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi cập nhật địa chỉ',
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      });
    }
  }
}

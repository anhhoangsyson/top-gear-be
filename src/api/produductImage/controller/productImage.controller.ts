import { Request, Response } from 'express';
import { ProductImageService } from '../service/productImage.service';
import {
  CreateProductImageDto,
  ProductImageResponseDto,
  ProductImageResponseDtoType,
} from '../dto/productImage.dto';
import { ProductImageRepository } from '../repository/productImage.repository';
import cloudinary from '../../../config/cloudinary/cloudinary.config';
export class ProductImageController {
  private productImageService = new ProductImageService();

  private productImageRepository = new ProductImageRepository();
  async createProductImage(req: Request, res: Response) {
    try {
      // check is upload file is image
      if (!req.file) {
        return res.status(400).send('Please upload an image');
      }
      // validation req with dto
      // const { success, error } = CreateProductImageDto.safeParse(req.body)
      // if (!success) {
      //   return res.status(400).json({ errors: error.message });
      // }

      // const productVariantId = req.body.productVariantId?.productVariantId || req.body.productVariantId;
      const productVariantId = req.body.productVariantId;

      const imageUrl = req.file.path; // url img from cloudinary
      console.log('img', imageUrl);
      console.log('req.file', req.file);

      // save image to db

      const data = { productVariantId, imageUrl };
      console.log(data);

      const productImage =
        await this.productImageService.createProductImage(data);

      // validate response with dto before return to client
      // const responseData = ProductImageResponseDto.parse(productImage.toObject());
      console.log(productImage);

      return res.status(201).json({
        message: 'Image uploaded successfully',
        data: productImage,
      });
    } catch (error) {
      return res.status(500).send({ message: 'Internal Server Error', error });
    }
  }

  async deleteProductImage(req: Request, res: Response) {
    try {
      const { imgId } = req.params;

      // Kiểm tra xem ảnh có tồn tại không
      const image =
        await this.productImageRepository.getProductImageById(imgId);

      if (!image) return res.status(404).json({ message: 'Image not found' });

      // Xóa ảnh trên Cloudinary
      const publicId = image.imageUrl.split('/').pop()?.split('.')[0];
      await cloudinary.uploader.destroy(`public/${publicId}`);

      // Xóa ảnh trong database
      await this.productImageService.deleteProductImageById(imgId);

      res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error });
    }
  }

  async getFirstProductImageByProductVariantId(req: Request, res: Response) {
    try {
      const productVariantId = req.params.productVariantId;
      const productImage =
        await this.productImageService.getFirstProductImageByProductVariantId(
          productVariantId,
        );
      if (!productImage) {
        return res.status(404).json({ message: 'Image not found' });
      }
      return res.status(200).json({
        data: productImage,
        message: 'Get first product image successfully',
      });
    } catch (error) {
      return res.status(500).send({ message: 'Internal Server Error', error });
    }
  }
}

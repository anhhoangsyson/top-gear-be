import mongoose from 'mongoose';
import {
  IProductVariantDetail,
  IProductVariants,
  ProductVariants,
} from '../schema/productVariants.schema';
import { StatusProductVariant } from '../../../constants/status/status.constant';

export const ProductVariantsRepository = {
  async getAllPrductVariants() {
    return await ProductVariants.aggregate([
      {
        $lookup: {
          from: 'productimages',
          localField: '_id',
          foreignField: 'productVariantId',
          as: 'images',
        },
      },
      {
        $group: {
          _id: '$_id',
          variantName: { $first: '$variantName' },
          variantStock: { $first: '$variantStock' },
          variantPrice: { $first: '$variantPrice' },
          variantPriceSale: { $first: '$variantPriceSale' },
          images: { $first: '$images' },
        },
      },
    ]);
  },

  async getProductVariantsByChildId(childId: string) {
    return await ProductVariants.aggregate([
      { $match: { filterCategories: childId } },
      // Lookup vào productImages để lấy danh sách ảnh của sản phẩm
      {
        $lookup: {
          from: 'productimages',
          localField: '_id',
          foreignField: 'productVariantId',
          as: 'images',
        },
      },

      // Lookup vào productAttributes để lấy danh sách thuộc tính của sản phẩm
      {
        $lookup: {
          from: 'productattributes',
          localField: '_id',
          foreignField: 'variantId',
          as: 'productAttributes',
        },
      },

      // Unwind để có thể lookup tiếp vào bảng attributes
      {
        $unwind: {
          path: '$productAttributes',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup vào attributes để lấy chi tiết từng thuộc tính
      {
        $lookup: {
          from: 'attributes',
          localField: 'productAttributes.attributeId',
          foreignField: '_id',
          as: 'attributeDetails',
        },
      },

      // Unwind attributeDetails (do lookup trả về mảng, nhưng mỗi thuộc tính chỉ có 1 giá trị)
      {
        $unwind: {
          path: '$attributeDetails',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Nhóm lại dữ liệu sau khi join để tránh bị duplicate do unwind
      {
        $group: {
          _id: '$_id',
          productId: { $first: '$productId' },
          variantName: { $first: '$variantName' },
          variantStock: { $first: '$variantStock' },
          variantPrice: { $first: '$variantPrice' },
          status: { $first: '$status' },
          images: { $first: '$images' },
          filterCategories: { $first: '$filterCategories' },
          // Tạo variantAttribute chứa attributeName và attributeValue
          variantAttributes: {
            $push: {
              attributeName: '$attributeDetails.attributeName',
              attributeValue: '$productAttributes.attributeValue',
            },
          },
        },
      },
    ]);
  },

  async createProductVariants(productVariantsData: IProductVariants) {
    return await ProductVariants.create(productVariantsData);
  },

  async findByProductId(productId: string): Promise<IProductVariants[]> {
    const objectId = new mongoose.Types.ObjectId(productId);
    return await ProductVariants.find({ productId: objectId });
  },
  async findProductVariantsByFilter(filterData: any) {
    return await ProductVariants.aggregate([
      { $match: { filterCategories: { $in: filterData } } },
      {
        $lookup: {
          from: 'productimages',
          localField: '_id',
          foreignField: 'productVariantId',
          as: 'images',
        },
      },

      // Lookup vào productAttributes để lấy danh sách thuộc tính của sản phẩm
      {
        $lookup: {
          from: 'productattributes',
          localField: '_id',
          foreignField: 'variantId',
          as: 'productAttributes',
        },
      },

      // Unwind để có thể lookup tiếp vào bảng attributes
      {
        $unwind: {
          path: '$productAttributes',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup vào attributes để lấy chi tiết từng thuộc tính
      {
        $lookup: {
          from: 'attributes',
          localField: 'productAttributes.attributeId',
          foreignField: '_id',
          as: 'attributeDetails',
        },
      },

      // Unwind attributeDetails (do lookup trả về mảng, nhưng mỗi thuộc tính chỉ có 1 giá trị)
      {
        $unwind: {
          path: '$attributeDetails',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Nhóm lại dữ liệu sau khi join để tránh bị duplicate do unwind
      {
        $group: {
          _id: '$_id',
          variantName: { $first: '$variantName' },
          variantStock: { $first: '$variantStock' },
          variantPrice: { $first: '$variantPrice' },
          variantPriceSale: { $first: '$variantPriceSale' },
          status: { $first: '$status' },
          images: { $first: '$images' },

          // Tạo variantAttribute chứa attributeName và attributeValue
          variantAttributes: {
            $push: {
              attributeName: '$attributeDetails.attributeName',
              attributeValue: '$productAttributes.attributeValue',
            },
          },
        },
      },
    ]);
  },
  async getProductVariantsByCategory(id: string) {
    console.log('id', id);
    return await ProductVariants.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },

      // Lookup vào productImages để lấy danh sách ảnh của sản phẩm
      {
        $lookup: {
          from: 'productimages',
          localField: '_id',
          foreignField: 'productVariantId',
          as: 'images',
        },
      },

      // Lookup vào productAttributes để lấy danh sách thuộc tính của sản phẩm
      {
        $lookup: {
          from: 'productattributes',
          localField: '_id',
          foreignField: 'variantId',
          as: 'productAttributes',
        },
      },

      // Unwind để có thể lookup tiếp vào bảng attributes
      {
        $unwind: {
          path: '$productAttributes',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup vào attributes để lấy chi tiết từng thuộc tính
      {
        $lookup: {
          from: 'attributes',
          localField: 'productAttributes.attributeId',
          foreignField: '_id',
          as: 'attributeDetails',
        },
      },

      // Unwind attributeDetails (do lookup trả về mảng, nhưng mỗi thuộc tính chỉ có 1 giá trị)
      {
        $unwind: {
          path: '$attributeDetails',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Nhóm lại dữ liệu sau khi join để tránh bị duplicate do unwind
      {
        $group: {
          _id: '$_id',
          variantName: { $first: '$variantName' },
          variantStock: { $first: '$variantStock' },
          variantPrice: { $first: '$variantPrice' },
          variantPriceSale: { $first: '$variantPriceSale' },
          status: { $first: '$status' },
          images: { $first: '$images' },

          // Tạo variantAttribute chứa attributeName và attributeValue
          variantAttributes: {
            $push: {
              attributeName: '$attributeDetails.attributeName',
              attributeValue: '$productAttributes.attributeValue',
            },
          },
        },
      },
    ]);

    // return await ProductVariants.findOne({id})
  },

  async getProductVariantsCategory(id: string) {
    return await ProductVariants.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'categories',
          localField: 'filterCategorires',
          foreignField: '_id',
          as: 'categories',
        },
      },
    ]);
  },
  async updateProductVariantsById(
    productVariantsId: string,
    productVariantsData: Partial<IProductVariants>,
  ) {
    return await ProductVariants.findByIdAndUpdate(
      productVariantsId,
      productVariantsData,
      { new: true },
    );
  },

  async inActiveProductVariantsById(
    productVariantsId: string,
  ): Promise<IProductVariants | null> {
    return await ProductVariants.findByIdAndUpdate(
      productVariantsId,
      { status: StatusProductVariant.INACTIVE },
      { new: true },
    );
  },

  async activeProductVariantsById(productVariantsId: string) {
    return await ProductVariants.findByIdAndUpdate(
      productVariantsId,
      { status: StatusProductVariant.ACTIVE },
      { new: true },
    );
  },

  async getProductVariantsRelated(productVariantId: string) {
    const result = await ProductVariants.aggregate([
      // Bước 1: Tìm biến thể hiện tại để lấy productId
      {
        $match: {
          _id: new mongoose.Types.ObjectId(productVariantId),
        },
      },
      // Bước 2: Tìm tất cả biến thể liên quan có cùng productId
      {
        $lookup: {
          from: 'productvariants', // Tên collection ProductVariants
          let: { currentProductId: '$productId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$productId', '$$currentProductId'] },
                    {
                      $ne: [
                        '$_id',
                        new mongoose.Types.ObjectId(productVariantId),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: 'relatedVariants',
        },
      },
      // Bước 3: Bỏ biến thể hiện tại, chỉ giữ relatedVariants
      {
        $unwind: {
          path: '$relatedVariants',
          preserveNullAndEmptyArrays: true, // Giữ nếu không có biến thể liên quan
        },
      },
      // Bước 4: Lookup để lấy ảnh từ collection images
      {
        $lookup: {
          from: 'productimages', // Tên collection Images
          localField: 'relatedVariants._id',
          foreignField: 'productVariantId',
          as: 'relatedVariants.images',
        },
      },
      // Bước 5: Dựng dữ liệu trả về
      {
        $project: {
          _id: '$relatedVariants._id',
          productId: '$relatedVariants.productId',
          variantName: '$relatedVariants.variantName',
          variantStock: '$relatedVariants.variantStock',
          variantPrice: '$relatedVariants.variantPrice',
          variantPriceSale: '$relatedVariants.variantPriceSale',
          image: { $arrayElemAt: ['$relatedVariants.images.imageUrl', 0] }, // Lấy ảnh đầu tiên
        },
      },
      // Bước 6: Nhóm lại thành mảng
      {
        $group: {
          _id: null,
          variants: {
            $push: {
              _id: '$_id',
              productId: '$productId',
              variantName: '$variantName',
              variantStock: '$variantStock',
              variantPrice: '$variantPrice',
              variantPriceSale: '$variantPriceSale',
              image: { $ifNull: ['$image', ''] }, // Đảm bảo image là chuỗi
            },
          },
        },
      },
      // Bước 7: Chỉ trả về mảng variants
      {
        $project: {
          _id: 0,
          variants: 1,
        },
      },
    ]);

    return result[0]?.variants || []; // Trả về mảng variants, hoặc mảng rỗng nếu không có
  },
};

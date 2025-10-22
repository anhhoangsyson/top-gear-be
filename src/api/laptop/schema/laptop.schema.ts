import { string } from 'joi';
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface CustomDocument extends Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISpecifications {
  processor: string; // cpu
  processorGen?: string; // thế hệ 12th gen
  processorSpeed?: number; // tốc độ cpu, đơn vị GHz
  ram: number; // dung lượng ram, đơn vị GB
  ramType?: string; // loại ram, DDR4, DDR5
  storage: number; // dung lượng ổ cứng, đơn vị GB
  storageType?: string; // loại ổ cứng, SSD, HDD
  graphicsCard?: string; // card đồ họa, ví dụ: NVIDIA GeForce RTX 3060
  graphicsMemory?: number; // dung lượng card đồ họa, đơn vị GB
  displaySize: number; // kích thước màn hình đơn vị inch
  displayResolution?: string; // độ phân giải 1920x1280
  displayType?: string; // loại màn hình, IPS, TN, OLED
  refreshRate?: number; // tần số quét, đơn vị Hz
  touchscreen?: boolean; // cảm ứng hay không
  battery?: string; // dung lượng pin, ví dụ: 50Wh
  batteryLife?: number; // thời gian sử dụng pin, đơn vị giờ
  operatingSystem?: string; // hệ điều hành, ví dụ: Windows 11, macOS
  ports?: string[]; // các cổng kết nối, ví dụ: USB-C, HDMI, Thunderbolt
  webcam?: string; // độ phân giải webcam, ví dụ: 720p, 1080p
  keyboard?: string; // loại bàn phím, ví dụ: bàn phím cơ, bàn phím chiclet
  speakers?: string; // loại loa, ví dụ: loa stereo, loa Dolby Atmos
  connectivity?: string; // kết nối không dây, ví dụ: Wi-Fi 6, Bluetooth 5.0
}

export interface IImage {
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface IRatings {
  average: number;
  count: number;
}

export interface ISeoMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}
export interface ICreateLaptop {
  modelName: string;
  name: string;
  brandId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  description?: string;
  price: number;
  discountPrice?: number; // giá giảm < giá gốc
  stock: number; // số lượng hàng trong kho
  warranty?: number; // bao hành tính bằng tháng
  releaseYear?: number; // năm phát hành
  status: 'new' | 'refurbished' | 'used'; // tình trạng máy, mới, đã qua sử dụng, tân trang
  weight?: number; // trọng lượng máy tính xách tay
  dimensions?: string; // kích thước máy tính xách tay
  specifications: ISpecifications; // thông số kỹ thuật máy tính xách tay
  images: IImage[];
  slug: string;
}
export interface ILaptop extends CustomDocument {
  modelName: string;
  name: string;
  brandId: {
    _id: mongoose.Types.ObjectId;
    name: string;
    logo?: string;
  };
  categoryId: {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
  };
  description?: string;
  price: number;
  discountPrice?: number; // giá giảm < giá gốc
  stock: number; // số lượng hàng trong kho
  warranty?: number; // bao hành tính bằng tháng
  releaseYear?: number; // năm phát hành
  status: 'new' | 'refurbished' | 'used'; // tình trạng máy, mới, đã qua sử dụng, tân trang
  weight?: number; // trọng lượng máy tính xách tay
  dimensions?: string; // kích thước máy tính xách tay
  specifications: ISpecifications; // thông số kỹ thuật máy tính xách tay
  images: IImage[];
  ratings: IRatings; // đánh giá trung bình và số lượng đánh giá
  isActive: boolean;
  isPromoted: boolean; // có được quảng cáo hay không
  tags?: string[]; // từ khóa tìm kiếm
  slug: string;
  seoMetadata?: ISeoMetadata; // metadata cho SEO
  createdAt: Date;
  updatedAt: Date;
}

const specificationsSchema = new Schema<ISpecifications>({
  processor: {
    type: String,
    required: true,
  },
  processorGen: {
    type: String,
  },
  processorSpeed: {
    type: Number,
  },
  ram: {
    type: Number,
    required: true,
    min: 1,
  },
  ramType: {
    type: String,
  },
  storage: {
    type: Number,
    required: true,
    min: 1,
  },
  storageType: {
    type: String,
  },
  graphicsCard: {
    type: String,
  },
  graphicsMemory: {
    type: Number,
  },
  displaySize: {
    type: Number,
    required: true,
  },
  displayResolution: {
    type: String,
  },
  displayType: {
    type: String,
  },
  refreshRate: {
    type: Number,
  },
  touchscreen: {
    type: Boolean,
    default: false,
  },
  battery: {
    type: String,
  },
  batteryLife: {
    type: Number,
  },
  operatingSystem: {
    type: String,
  },
  ports: [String],
  webcam: {
    type: String,
  },
  keyboard: {
    type: String,
  },
  speakers: {
    type: String,
  },
  connectivity: {
    type: String,
  },
});

const imageSchema = new Schema<IImage>({
  imageUrl: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
});

const ratingsSchema = new Schema<IRatings>({
  average: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  count: {
    type: Number,
    min: 0,
    default: 0,
  },
});

const seoMetadataSchema = new Schema<ISeoMetadata>({
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  keywords: [String],
});

const laptopSchema = new Schema<ILaptop>(
  {
    modelName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    warranty: {
      type: Number,
      min: 0,
    },
    releaseYear: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['new', 'refurbished', 'used'],
      default: 'new',
    },
    weight: {
      type: Number,
    },
    dimensions: {
      type: String,
    },
    specifications: {
      type: specificationsSchema,
      required: true,
    },
    images: [imageSchema],
    ratings: {
      type: ratingsSchema,
      default: () => ({}),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPromoted: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    slug: {
      type: String,
    },
    seoMetadata: {
      type: seoMetadataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

// Tạo text index cho tìm kiếm
laptopSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  'specifications.processor': 'text',
});

const Laptop: Model<ILaptop> = mongoose.model<ILaptop>('Laptop', laptopSchema);

export default Laptop;

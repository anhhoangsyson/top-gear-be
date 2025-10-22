import mongoose, { Schema, Document } from 'mongoose';

export interface ILaptopGroup extends Document {
  name: string;
  slug: string;
  description?: string;
  laptops: mongoose.Types.ObjectId[]; // Tham chiếu tới Laptop
  isActive: boolean;
  sortOrder?: number;
  backgroundImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const laptopGroupSchema = new Schema<ILaptopGroup>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    laptops: [{ type: Schema.Types.ObjectId, ref: 'Laptop', required: true }],
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    backgroundImage: { type: String },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ILaptopGroup>('LaptopGroup', laptopGroupSchema);

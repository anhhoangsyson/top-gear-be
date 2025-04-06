import mongoose, { Schema, Document } from 'mongoose';

// Interface cho Location document
export interface ILocation extends Document {
  userId: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

// Schema Mongoose
const LocationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true }, // Index để tối ưu truy vấn theo userId
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    street: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }, // Thêm createdAt, updatedAt
);

// Export model
export default mongoose.model<ILocation>('Location', LocationSchema);

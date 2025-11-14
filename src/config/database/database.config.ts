import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const buildUri = () => {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const user = process.env.DB_USER || '';
  const pass = process.env.DB_PASSWORD
    ? encodeURIComponent(process.env.DB_PASSWORD)
    : '';
  const host =
    process.env.DB_HOST || 'cluster-ecom-cho-be-tai.nwdiimc.mongodb.net';
  const db = process.env.DB_NAME || 'ecomerce-top-gear';
  return `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`;
};

const connectDatabase = async () => {
  const uri = buildUri();
  const connectWithRetry = async () => {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 4500,
      } as mongoose.ConnectOptions);
      console.log('Connected mongodb thành công');
    } catch (error) {
      console.log('Không thể kết nối với mongodb. Lỗi: ', error);
      setTimeout(connectWithRetry, 5000);
    }
  };
  await connectWithRetry();
};
export default connectDatabase;

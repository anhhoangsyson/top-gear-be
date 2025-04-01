import mongoose from 'mongoose';

const connectDatabase = async () => {
  const connectWithRetry = async () => {
    try {
      await mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@database.rylr1.mongodb.net/?retryWrites=true&w=majority&appName=database`,
        {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 4500,
        },
      );
      console.log(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@database.rylr1.mongodb.net/?retryWrites=true&w=majority&appName=database`,
      );

      console.log('Connected mongodb thành công');
    } catch (error) {
      console.log('Không thể kết nối với mongodb. Lỗi: ', error);
      setTimeout(connectWithRetry, 5000);
    }
  };
  await connectWithRetry();
};
export default connectDatabase;

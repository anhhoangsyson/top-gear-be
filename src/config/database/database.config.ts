import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const buildUri = () => {
  const raw = process.env.MONGO_URI;
  // Use raw MONGO_URI only when it contains credentials (user:pass@)
  if (raw) {
    const hasCreds = /:\/\/[^/]+:[^@]+@/.test(raw);
    if (hasCreds || !(process.env.DB_USER || process.env.DB_PASSWORD)) {
      return raw;
    }
    // If MONGO_URI exists but doesn't include credentials, prefer building
    // the URI from DB_USER/DB_PASSWORD to avoid unauthenticated connections.
  }

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
  const maskUri = (u: string) => {
    try {
      const parts = u.split('://');
      if (parts.length < 2) return u;
      const scheme = parts[0];
      const rest = parts[1];
      const atIndex = rest.indexOf('@');
      if (atIndex === -1) return `${scheme}://${rest}`;
      // show scheme and host/db but hide credentials
      return `${scheme}://***@${rest.slice(atIndex + 1)}`;
    } catch {
      return '***';
    }
  };

  const source = process.env.MONGO_URI
    ? /:\/\/[^/]+:[^@]+@/.test(process.env.MONGO_URI)
      ? 'MONGO_URI (with credentials)'
      : 'constructed (MONGO_URI ignored because it lacks credentials)'
    : 'constructed from DB_USER/DB_PASSWORD';

  console.log('Using Mongo URI (masked):', maskUri(uri), 'source:', source);

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

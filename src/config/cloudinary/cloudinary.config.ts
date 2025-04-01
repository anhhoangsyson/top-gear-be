import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const cloudName = process.env.CLOUDINARY_NAME;
const cloudApiKey = process.env.CLOUDINARY_API_KEY;
const clouApiSecret = process.env.CLOUDINARY_API_SECRET;
if (!cloudName || !cloudApiKey || !clouApiSecret) {
  console.log('Missing Cloudinary environment variables');
}
cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: clouApiSecret,
});

export default cloudinary;

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary/cloudinary.config';

// config storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'upload', // folder in Cloudinary to store images
      // format: ["png","jpg"], // type of images
      format: 'jpg', // type of images
      public_id: file.originalname.split('.')[0], // save original name of the uploaded image
    };
  },
});

// Middleware Multer to upload images
const upload = multer({ storage });

export default upload;

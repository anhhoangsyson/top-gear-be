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
const upload = multer({ storage }).fields([
  { name: 'files', maxCount: 10 }, // max 10 files
  { name: 'image', maxCount: 10 }, // max 10 images
  { name: 'logo', maxCount: 1 }, // max 1 logo
  { name: 'imageUrl', maxCount: 10 }, // max 10 imageUrl
]);
export const uploadMultiple = multer({ storage }).array('files', 10); // upload multiple images
export const uploadSingle = multer({ storage }).single('imageUrl'); // upload single image
export const uploadSingleLogo = multer({ storage }).single('logo'); // upload single logo
export const uploadSingleImage = multer({ storage }).single('image'); // upload single imageUrl
export const uploadSingBgImage = multer({ storage }).single('backgroundImage'); // upload single imageUrl
export default upload;

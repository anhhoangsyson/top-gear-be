// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from '../../config/cloudinary/cloudinary.config';
// import { RequestHandler } from 'express';
// interface CustomParams {
//   folder: string;
//   format: (req: Express.Request, file: Express.Multer.File) => string;
//   public_id: (req: Express.Request, file: Express.Multer.File) => string;
// }
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'upload',
//     format: (req, file) => 'webp',
//     public_id: (req, file) =>
//       Date.now() + '-' + file.originalname.split('.')[0],
//   } as CustomParams,
// });

// const upload = multer({
//   storage: storage,
// });

// const uploadImage: RequestHandler = async (req, res, next) => {
//     try {
//       const file = req.file

//       if (!file) {
//         return res.status(400).json({ message: 'No file uploaded' })
//       }

//       req.body.image = file.path
//     } catch (error: any) {
//       return res.status(500).json({
//         message: 'Image upload failed',
//         error: error.message
//       })
//     }
//     next()
//   }

// export { upload };

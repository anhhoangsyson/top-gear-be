import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const getAccessToken = (_id: mongoose.Types.ObjectId, role: string) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
};

const getRefeshToken = (_id: mongoose.Types.ObjectId, role: string) => {
  return jwt.sign({ _id, role }, process.env.JWT_REFESH_SECREt as string, {
    expiresIn: '70d',
  });
};
export { getAccessToken, getRefeshToken };

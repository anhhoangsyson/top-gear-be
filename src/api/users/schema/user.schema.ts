import { Schema, model } from 'mongoose';
import { IUser } from '../dto/users.dto';
import { sexUsers } from '../../../constants/users/sex/sex_users.constants';
import { roleUsers } from '../../../constants/users/role/role_users.constants';

const usersSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    usersname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    avatar: { type: String },
    sex: {
      type: String,
      enum: [sexUsers.MALE, sexUsers.FEMALE, sexUsers.OTHER],
      default: sexUsers.MALE,
    },
    role: {
      type: String,
      enum: [roleUsers.ADMIN, roleUsers.MANAGER, roleUsers.USERS],
      default: roleUsers.USERS,
    },
  },
  { timestamps: true },
);

export const Users = model<IUser>('users', usersSchema);

import { Schema, model } from 'mongoose';
import { IUser } from '../dto/users.dto';
import { sexUsers } from '../../../constants/users/sex/sex_users.constants';
import { roleUsers } from '../../../constants/users/role/role_users.constants';

const socialAuthSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: { type: String, require: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    profile: {
      type: Schema.Types.Mixed,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);
const usersSchema = new Schema<IUser>(
  {
    // cac truong bat buoc
    fullname: { type: String, required: true },
    usersname: {
      type: String,
      required: function (this: any): boolean {
        return this.authType === 'local';
      },
    },
    password: {
      type: String,
      required: function (this: any): boolean {
        return this.authType === 'local';
      },
    },
    email: { type: String, required: true },
    // cac truong khong bat buoc
    phone: { type: Number, required: false },
    address: { type: String, required: false },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dqj0xgk8v/image/upload/v1698230982/avt/avt_default.png',
    },

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

    socialAuth: [socialAuthSchema],
    authType: {
      type: String,
      enum: ['local', 'facebook', 'google'],
      default: 'local',
    },
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

usersSchema.index({ 'socialAuth.providerId': 1 });
usersSchema.index({ email: 1 });

export const Users = model<IUser>('users', usersSchema);

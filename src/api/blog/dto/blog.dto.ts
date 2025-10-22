import mongoose, { Types } from 'mongoose';

export interface Iblog {
  title: string;
  content: string;
  userId: Types.ObjectId;
  tags: string[];
  thumbnail: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatblog {
  title: string;
  content: string;
  userId: Types.ObjectId;
  tags: string[];
  thumbnail: string;
}

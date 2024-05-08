import { Document, Types } from 'mongoose';

export interface carts extends Document{
  productId: Types.ObjectId;
  price: number;
  userId: Types.ObjectId;
  quantity: number;
}

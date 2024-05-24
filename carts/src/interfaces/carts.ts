import { Document } from 'mongoose';

export interface Cart extends Document {
  userId: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

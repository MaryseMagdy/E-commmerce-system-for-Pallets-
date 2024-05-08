import { Document, Types } from 'mongoose';
export interface order extends Document {
  orderNumber: string;
  date: Date;
  items: Array<{
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
}
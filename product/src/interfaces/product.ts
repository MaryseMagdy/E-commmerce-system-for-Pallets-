import { Document, Types } from 'mongoose';
export interface Product extends Document {
  image: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  availability: boolean;
  color: string;
  material: string;
  size: number;
  customized: boolean;
  ratings: number[];
}
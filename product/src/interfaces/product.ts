import mongoose, { ObjectId, mongo } from "mongoose";
export interface Review {
  userId: mongoose.Types.ObjectId;
  rating: number;
  content: string;
  productId:mongoose.Types.ObjectId;
}

export interface Product extends Document {
  image: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  availability: boolean;
  color: string;
  material: string;
  width: number;
  height: number;
  quantity: number;
  customized: boolean;
  ratings: number[];
  rentEndDate: Date;
  rentStartDate: Date;
  totalRentalPrice: number;
  dailyRate: number;
  deposit: number;
  reviews: Review[];
}
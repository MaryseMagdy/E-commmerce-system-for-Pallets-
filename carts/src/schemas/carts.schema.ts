import { Schema } from 'mongoose';

const cartSchema: Schema = new Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

export const CartSchema = cartSchema;


import mongoose, { Schema } from 'mongoose';

const cartsSchema: Schema = new Schema({
  CartID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

export const CartsSchema = cartsSchema;

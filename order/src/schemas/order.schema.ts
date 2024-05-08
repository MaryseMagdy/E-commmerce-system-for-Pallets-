import mongoose, { Schema } from 'mongoose';

const orderSchema: Schema = new Schema({
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  productID: {
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
  status: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  
});

export const OrderSchema = orderSchema;

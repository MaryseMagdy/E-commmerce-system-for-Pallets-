// import { register } from 'module';
// import mongoose, { Schema } from 'mongoose';


// const orderItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   }
// });

// export const orderSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   items: [orderItemSchema],
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   status: {
//     type: String,
//     required: true
//   },
//   totalAmount: {
//     type: Number,
//     required: true
//   }
// });

// export const OrderSchema = orderSchema;

// schemas/order.schema.ts
import { Schema, Document } from 'mongoose';

export const OrderSchema = new Schema({
    userId: {
       type: Schema.Types.ObjectId, 
      ref: 'user-auth' },
    date: { 
      type: Date,
       default: Date.now },
    items: [{
        productId: {
           type: Schema.Types.ObjectId, 
           ref: 'Product' },
        quantity: Number,
        price: Number,
    }],
    totalAmount: Number,
    status: String,
});

export interface Order extends Document {
    userId: string;
    date: Date;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    status: string;
}

import { register } from 'module';
import mongoose, { Schema } from 'mongoose';
const orderItemSchema: Schema = new Schema({
  productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
  },
  quantity: {
      type: Number,
      required: true,
  },
  price: {
      type: Number,
      required: true,
  }
});
const orderSchema: Schema = new Schema({
  userId: {
      type: Schema.Types.ObjectId,
      ref: 'UserAuth',
      required: true,
  },
  items: [orderItemSchema],
  date: {
      type: Date,
      required: true,
  },
  status: {
      type: String,
      required: true,
  },
  totalAmount: {
      type: Number,
      required: true,
  }
});
const addressSchema: Schema = new Schema({
  label:{
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  }
});

const favouriteSchema: Schema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
});
const ReviewSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true },
});

const userAuthSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNum: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: false
  },
  address: {
    type: [addressSchema],  
    required: false
  },
  reviews: {
    type: [ReviewSchema],
    required: false
  },
  wishlist: [{
    _id:String,
    name: String,
    price: Number,
    description: String,
    color: String,
    material: String,
    image: String,
    width: Number,
    height: Number,
    rating: Number,
  }],
  resetPasswordToken:{
    type: String,
    default: null 
  
  },
  registerToken:{
    type: String,
    default: null
  },
  favourite: {
    type: [favouriteSchema],
    default: []
  },
  cards: [
    {
      cardId: String,
      last4: String,
      brand: String,
      exp_month: Number,
      exp_year: Number,
      funding: String,
      country: String,
      // number: String,
      // cvv: String,
    },
  ],
  orders: [orderSchema],
  cart: [{ type: Schema.Types.ObjectId, ref: 'Cart' }],

});

export const UserAuthSchema = userAuthSchema;

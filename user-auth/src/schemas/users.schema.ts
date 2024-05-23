import { register } from 'module';
import mongoose, { Schema } from 'mongoose';

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
  productId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  productImage: {
    type: String,
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
  favourite: [{
    type: Schema.Types.ObjectId,
    ref: 'product',  
    default: []
}]
});

export const UserAuthSchema = userAuthSchema;

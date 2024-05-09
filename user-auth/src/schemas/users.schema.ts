import mongoose, { Schema } from 'mongoose';

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
    type: String
  },
  wishlist: {
    type: [String],
    required: false
  },
  resetPasswordToken:{
    type: String,
    default: null 
  
  }
});

export const UserAuthSchema = userAuthSchema;

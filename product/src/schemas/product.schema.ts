import mongoose, { Schema } from 'mongoose';

const productSchema: Schema = new Schema({
  image: {
    type: String,
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
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
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
  size: {
    type: Number,
    required: true
  },
  customized: {
    type: Boolean,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  ratings: {
    type: [Number],
    default: []
  }
});

export const ProductSchema = productSchema;

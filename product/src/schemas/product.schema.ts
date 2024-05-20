import mongoose, { Schema } from 'mongoose';

const productSchema: Schema = new Schema({
  image: {
    type: String,
    required: false
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
  width: {
    type: Number,
    required: true
  },
  height:{
    type: Number,
    required: true
  },
  customized: {
    type: Boolean,
    required: true
  },
  ratings: {
    type: [Number],
    default: [],
    validate: {
      validator: function (v: number[]) {
        return Array.isArray(v);
      },
      message: props => `${props.value} is not a valid array of numbers!`
    }
  }
});

export const ProductSchema = productSchema;
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
  dailyRate: {
    type: Number,
    required: false
  },
  deposit: {
    type: Number,
    required: false,
    default: 50
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
  },
  rentStartDate:{
    type: Date,
    required: false,
  },
  rentEndDate:{
    type: Date,
    required: false,
  },
  totalRentalPrice: {
    type: Number,
    required: false
  },
  offers:{
    type: String,
    required: false,
    default:"0"
  },
  reviews: {
    type: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          required: true
        },
        rating: {
          type: Number,
          required: true
        },
        content: {
          type: String,
          required: true
        },
        productId: {
          type: mongoose.Types.ObjectId,
          required: true
        }
      }
    ],
    default: []
  }
});

export const ProductSchema = productSchema;

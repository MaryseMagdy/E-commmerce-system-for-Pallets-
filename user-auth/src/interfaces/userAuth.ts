import mongoose, { ObjectId, Types, mongo } from "mongoose";
export interface Order {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }
  
  export interface UserOrder {
    userId: mongoose.Types.ObjectId;
    items: Order[];
    date: Date;
    status: string;
    totalAmount: number;
  }
export interface Card {
    cardId: string;
    last4: string;
    brand: string;
    exp_month: number;
    exp_year: number;
    funding: string;
    country: string;
    // number: string;
    // cvv: string;
  }


export interface userAuth extends Document {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    phoneNum: string;
    company?: string;
    address: {
        label: string;
        street: string;
        city: string;
        state: string;
        zip: string;
    }[];
    reviews: {
        content: string;
        userId: mongoose.Types.ObjectId;
        productId: mongoose.Types.ObjectId;
        rating: number;
    }[];
    favourite: {
        _id: mongoose.Types.ObjectId;
        name: string;
        price: number;
        description: string;
        color: string;
        material: string;
        image: string;
        width: number;
        height: number;
        rating: number;
      }[];
    wishlist: {
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
    }[]
    resetPasswordToken: string;
    registerToken: string;
    cards: Card[];
    orders: UserOrder[];
    cart: Array<Types.ObjectId>;
  }


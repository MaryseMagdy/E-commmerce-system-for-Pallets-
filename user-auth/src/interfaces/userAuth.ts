import mongoose, { ObjectId, mongo } from "mongoose";

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
    favourite: mongoose.Types.ObjectId[]; 
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
}


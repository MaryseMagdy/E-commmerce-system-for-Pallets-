import mongoose, { mongo } from "mongoose";

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
    favourite: mongoose.Types.ObjectId[]; 
    wishlist: string[];
    resetPasswordToken: string;
    registerToken: string;
}


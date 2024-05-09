
export interface userAuth extends Document {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    phoneNum: string;
    company?: string;
    address?: string;
    wishlist: string[];
    resetPasswordToken: string;
}

import { first } from "rxjs";

export class UserDTO {
    readonly firstName: string;
    readonly lastName: string;
    readonly username: string;
    readonly password: string;
    readonly email: string;
    readonly phoneNum: string;
    readonly company?: string;
    readonly address?: string;
    readonly wishlist: string[];
    resetPasswordToken: string | null = null; // Initialize resetPasswordToken to null by default
    toString(){
        return JSON.stringify({
            firstName:this.firstName,
            lastName:this.lastName,
            username:this.username,
            password:this.password,
            email:this.email,
            phoneNum:this.phoneNum,
            company:this.company,
            address:this.address,
            wishlist:this.wishlist,
            resetPasswordToken:this.resetPasswordToken
        }
        );
    }
}
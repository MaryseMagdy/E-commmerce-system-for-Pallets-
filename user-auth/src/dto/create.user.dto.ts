import { register } from "module";
import { first } from "rxjs";

export class UserDTO {
    constructor(
        readonly firstName: string,
        readonly lastName: string,
        readonly username: string,
        readonly password: string,
        readonly email: string,
        readonly phoneNum: string,
        readonly wishlist: string[],
        readonly address: string[],
        readonly company: string,
        readonly resetPasswordToken: string | null = null,
        readonly registerToken:string | null = null,
    ){}
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
            resetPasswordToken:this.resetPasswordToken,
            registerToken:this.registerToken
        }
        );
    }
}
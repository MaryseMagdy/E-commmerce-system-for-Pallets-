import { first } from "rxjs";

export class userInfoDTO{
    readonly firstName: string;
    readonly lastName: string;
    readonly username: string;
    readonly email: string;
    readonly phoneNum: string;
    readonly company?: string;
    readonly address?: string;
    toString(){
        return JSON.stringify({
            firstName:this.firstName,
            lastName:this.lastName,
            username:this.username,
            email:this.email,
            phoneNum:this.phoneNum,
            company:this.company,
            address:this.address
        })
    }
}
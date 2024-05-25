import { first } from "rxjs";

export class LoginDto{
    readonly username: String;
    readonly password: String; 
    constructor(username: String, password: String){
        this.username = username;
        this.password = password;
    }
    toString(){
        return JSON.stringify({
            
            username:this.username,
            password:this.password}
        );
    }
}
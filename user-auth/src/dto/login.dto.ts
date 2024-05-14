import { first } from "rxjs";

export class LoginDto{
    readonly username: String;
    readonly password: String; 
    static username: string;
    static password: string;

    toString(){
        return JSON.stringify({
            
            username:this.username,
            password:this.password}
        );
    }
}
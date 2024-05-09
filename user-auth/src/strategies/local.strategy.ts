import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { userAuthService } from "../app.service";
import { LoginDto } from "../dto/login.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
constructor(private readonly identityService:userAuthService){
    super();
}
async validate(username:string, password:string):Promise<any>{
    console.log('validate:' ,username,password);

    var loginDto:LoginDto ={
        username,password
    }
}
}
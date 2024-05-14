import { ExtractJwt,Strategy } from "passport-jwt";

import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException} from "@nestjs/common";
import { userAuthService } from "../app.service";
import { LoginDto } from "../dto/login.dto";
//import { JwtPayload } from './jwt-payload.interface'; // Define this interface according to your payload structure

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
  
constructor(private readonly authService:userAuthService){
    console.log("In the jwt strategy");
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_secret_key',

    });
   console.log("jwt from request", ExtractJwt.fromAuthHeaderAsBearerToken());
}
async validate(payload: any):Promise<any>{
    console.log(payload);//from jwt token

    
    return payload;
}
}
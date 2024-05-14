import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { userAuthService } from "../app.service";
import { LoginDto } from "../dto/login.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authService: userAuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        console.log('validate:' ,username,password);
        
        var loginDto:LoginDto ={
            username,password
        }
        const user = await this.authService.validateUser(loginDto);
        if (!user || user===null) {
            throw new UnauthorizedException('Invalid login credentials');
        }
        console.log('validated user:', user);
        return user;
    }
}
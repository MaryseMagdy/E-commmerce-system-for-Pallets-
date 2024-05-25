<<<<<<< HEAD
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { userAuthService } from "../app.service";
import { LoginDto } from "../dto/login.dto";
=======
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { userAuthService } from '../app.service';
import { LoginDto } from '../dto/login.dto';
>>>>>>> 76dceef4bcc12aff7b1c330a4d70d06ae2cf0908

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: userAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const loginDto = new LoginDto(username, password);
    const result = await this.authService.validateUser(loginDto);
    if (!result.user) {
      throw new UnauthorizedException();
    }
    return result.user;
  }
}

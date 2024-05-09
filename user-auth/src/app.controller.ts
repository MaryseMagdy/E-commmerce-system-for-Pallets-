
import { Controller, Get, Post, Body } from '@nestjs/common';
import { userAuthService } from './app.service';
import { UserDTO } from './dto/create.user.dto'; // Import the UserDTO type
@Controller('user')
export class userAuthController {
  constructor(private readonly userAuthService: userAuthService) {}

  @Get('/gethello')
  getHello(): string {
    return this.userAuthService.getHello();
  }
  @Post('/register') 
  async register(@Body() UserDTO:UserDTO){
    return this.userAuthService.register(UserDTO);
  }
  @Get('/login')
  async login(@Body() loginDto){
    return this.userAuthService.validateUser(loginDto);
  }
}
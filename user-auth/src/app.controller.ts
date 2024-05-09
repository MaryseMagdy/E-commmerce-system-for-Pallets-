import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { userAuthService } from './app.service';
import { UserDTO } from './dto/create.user.dto'; // Import the UserDTO type
import { userInfoDTO } from './dto/userInfo.dto';
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
  @Get('/getuserinfo')
  async getUserinfo(@Body() userDto){
    return this.userAuthService.getUserinfo(userDto);
  }
  @Put('/changePassword/:id')
  async changePassword(@Param('id') userId: string, @Body() body: { password: string }) {
      const newPassword = body.password;
      return this.userAuthService.changePassword(userId, newPassword);
  }
  @Put('/editUserInfo/:id')
async editUserInfo(
    @Param('id') userId: string, 
    @Body() userInfoDTO: userInfoDTO
) {
    try {
        const result = await this.userAuthService.editUserInfo(userId, userInfoDTO);
        return { success: true, message: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
  }
  

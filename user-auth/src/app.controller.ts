import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, HttpStatus, Req, Res } from '@nestjs/common';
import { userAuthService } from './app.service';
import { Response, Request } from 'express';
import { UserDTO } from './dto/create.user.dto'; // Import the UserDTO type
import { userInfoDTO } from './dto/userInfo.dto';
import { AddressDto } from './dto/addAddress.dto';
import { ViewUserReview } from './dto/viewUserReview.dto';
import mongoose from 'mongoose';
import { Reviews } from './dto/reviews.dto';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class userAuthController {
  constructor(private readonly userAuthService: userAuthService) {}

  // @Get('/gethello')
  // getHello(): string {
  //   return this.userAuthService.getHello();
  // }
  @Post('/register') 
    async register(@Body() UserDTO:UserDTO){
      return this.userAuthService.register(UserDTO);
  }
  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response) {
      try {
          const { token, user } = await this.userAuthService.validateUser(loginDto);
          console.log(token);
          console.log(user);

          if (!token || !user) {
              res.status(401).json({ message: "Authentication failed" });
              return;
          }

          // Set cookie with the JWT and send response
          res.cookie('jwt', token, {
              httpOnly: true,
              secure: false,
              path: '/',
              maxAge: 3600000 
          });

          return res.json({ success: true, message: 'Logged in successfully', user });
      } catch (error) {
          return res.status(500).json({ message: error.message });
      }
  }

  @Get('/getuserinfo')
    async getUserinfo(@Body() userDto){
      return this.userAuthService.getUserinfo(userDto);
  }
  @Put('/changePassword/:id')
  async changePassword(
      @Param('id') userId: string,
      @Body() body: { currentPassword: string, newPassword: string }
  ) {
      const { currentPassword, newPassword } = body;
      return this.userAuthService.changePassword(userId, currentPassword, newPassword);
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
  @Post('/forget-password')
    async forgetPassword(@Body('email') email: string) {
        return await this.userAuthService.forgetPassword(email);
    }
  @Post('/forget-password/:token')
    async forgetPasswordT(@Param('token') resetPasswordToken: string, @Body('password') newPassword: string) {
        return await this.userAuthService.forgetPasswordT(resetPasswordToken, newPassword);
    }
  @Get('/verifyUser/:token')
    async verifyUser(@Param('token') token: string): Promise<any> {
        try {
            await this.userAuthService.verifyUser(token);
            return { success: true, message: 'Email verified successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
      }
    //Addresses
  @Post('/:userId/addAddress')
   async addAddress(@Param('userId') userId: string, @Body() address: AddressDto) {
    try {
        const result = await this.userAuthService.addAddress(userId, address);
        return { success: true, message: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
  }
  @Delete(':userId/addresses/:index')
  async deleteAddress(@Param('userId') userId: string, @Param('index') index: string) {
      return this.userAuthService.deleteAddress(userId, parseInt(index));
  }
  @Get('addresses/:userId')
  async getUserAddresses(@Param('userId') userId: string) {
    try {
        const result = await this.userAuthService.getUserAddresses(userId);
        if (result.success) {
            return { success: true, addresses: result.addresses };
        } else {
            throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
        }
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
@Put('/:userId/addresses/:index')
  async editAddress(@Param('userId') userId: string, @Param('index') index: string, @Body() addressDto: AddressDto) {
    try {
        const result = await this.userAuthService.editUserAddress(userId, parseInt(index), addressDto);
        return { success: true, message: 'Address updated successfully', address: result.address };
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/addToFavourites/:userId')
  async addToFavourites(@Param('userId') userId: string, @Body('productId') productId: mongoose.Types.ObjectId) {
    try {
        const result = await this.userAuthService.addToFavourites(userId, productId);
        return { success: result.success, message: result.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
  } 
  //Reviews
  @Post('reviews/:userId')
  async createReview(@Param('userId') userId: string, @Body() reviewData: Reviews) {
      try {
          const newReview = await this.userAuthService.createReview(userId, reviewData);
          return { success: true, message: 'Review added successfully', review: newReview };
      } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  
  @Get('reviews/:userId')
  async getUserReviews(@Param('userId') userId: string) {
      try {
          const reviews = await this.userAuthService.viewUserReviews(userId);
          return { success: true, reviews };
      } catch (error) {
          if (error instanceof HttpException) {
              throw error;
          }
          throw new HttpException('Unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  @Delete('reviews/:userId/:reviewId')
  async deleteReview(@Param('userId') userId: string, @Param('reviewId') reviewId: string) {
    try {
        const result = await this.userAuthService.deleteReview(userId, reviewId);
        return { success: true, message: result.message };
    } catch (error) {
        throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }
  @Put('reviews/:userId/:reviewId')
  async editReview(@Param('userId') userId: string, @Param('reviewId') reviewId: string, @Body() updateData: { content?: string, rating?: number }) {
    try {
        const updatedReview = await this.userAuthService.editReview(userId, reviewId, updateData);
        return { success: true, message: 'Review updated successfully', review: updatedReview };
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
}


}

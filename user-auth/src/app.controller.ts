<<<<<<< HEAD

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
=======
import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, HttpStatus, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { userAuthService } from './app.service';
import { Response, Request } from 'express';
import { UserDTO } from './dto/create.user.dto'; // Import the UserDTO type
import { userInfoDTO } from './dto/userInfo.dto';
import { AddressDto } from './dto/addAddress.dto';
import { ViewUserReview } from './dto/viewUserReview.dto';
import mongoose from 'mongoose';
import { Reviews } from './dto/Reviews.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';
import { AddToWishlistDTO } from './dto/addToWishlist.dto';
import { addToFavouritesDTO } from './dto/addToFavourites.dto';
import { Card } from './interfaces/userAuth';

interface JwtPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}

@Controller('user')
export class userAuthController {
  constructor(private readonly userAuthService: userAuthService) {}

  // @Get('/gethello')
  // getHello(): string {
  //   return this.userAuthService.getHello();
  // }


  // @Post('/register') 
  //   async register(@Body() UserDTO:UserDTO){
  //     return this.userAuthService.register(UserDTO);
  // }
 
  @Get(':id/cart')
  async getUserCarts(@Param('id') userId: string) {
    return this.userAuthService.getUserCarts(userId);
  }
  @Post('/rateProduct')
  async rateProduct(
      @Req() req: Request,
      @Body('productId') productId: string,
      @Body('rating') rating: number,
  ) {
      const user = req.user as JwtPayload;
      if (!user || !user.userId) {
          throw new UnauthorizedException('User not authenticated');
      }
      const userId = user.userId;
      console.log('Received request to rate product with:', { userId, productId, rating }); // Add logging here
      await this.userAuthService.rateProduct(userId, productId, rating);
      return { success: true, message: 'Product rated successfully' };
  }
  
  @Post('wishlist/add')
  async addToWishlist(@Body() addToWishlistDTO: AddToWishlistDTO) {
    const response = await this.userAuthService.addToWishlist(addToWishlistDTO);
    return response;
  }
  @Get('wishlist/:userId')
  async getWishlist(@Param('userId') userId: string) {
    const response = await this.userAuthService.getWishlist(userId);
    return response;
  }
  @Post('wishlist/remove')
  async removeFromWishlist(@Body() addToWishlistDTO: AddToWishlistDTO) {
    const response = await this.userAuthService.removeFromWishlist(addToWishlistDTO.userId, addToWishlistDTO.productId);
    return response;
  }
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const response = await this.userAuthService.logout(req, res);
    res.status(HttpStatus.OK).json(response);
  }
  @Post('/register') 
  async register(@Body() userDTO: UserDTO) {
    try {
      const result = await this.userAuthService.register({
        firstName: userDTO.firstName,
        lastName: userDTO.lastName,
        username: userDTO.username,
        email: userDTO.email,
        password: userDTO.password,
        phoneNum: userDTO.phoneNum,
        wishlist: [],
        address: [],
        company: '',
        resetPasswordToken: null,
        registerToken: null,
        reviews: [],
      });
      console.log(result);
      return result;
    } catch (error) {
      return {
        success: false,
        message: `Failed to register user: ${(error as Error).message}`,
      };
    }
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
          return res.status(500).json((error as Error).message);
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
        return { success: false,messag: (error as Error).message };
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
            return { success: false, message:(error as Error).message };
        }
      }
    //Addresses
  @Post('/:userId/addAddress')
   async addAddress(@Param('userId') userId: string, @Body() address: AddressDto) {
    try {
        const result = await this.userAuthService.addAddress(userId, address);
        return { success: true, message: result };
    } catch (error) {
        return { success: false, message: (error as Error).message };
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
            throw new HttpException((Error), HttpStatus.BAD_REQUEST);
        }
    } catch (error) {
        throw new HttpException(Error, HttpStatus.BAD_REQUEST);
    }
  }
@Put('/:userId/addresses/:index')
  async editAddress(@Param('userId') userId: string, @Param('index') index: string, @Body() addressDto: AddressDto) {
    try {
        const result = await this.userAuthService.editUserAddress(userId, parseInt(index), addressDto);
        return { success: true, message: 'Address updated successfully', address: result.address };
    } catch (error) {
        throw new HttpException(Error, HttpStatus.BAD_REQUEST);
    }
  }
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.userAuthService.getUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not found: ' + (error as Error).message);
    }
  }

  //Cards
  @Post(':userId/cards')
  async addCard(@Param('userId') userId: string, @Body() cardDetails: Card) {
    return this.userAuthService.addCard(userId, cardDetails);
  }

  @Delete(':userId/cards/:cardId')
  async removeCard(@Param('userId') userId: string, @Param('cardId') cardId: string) {
    return this.userAuthService.removeCard(userId, cardId);
  }

  @Put(':userId/cards/:cardId')
  async editCard(@Param('userId') userId: string, @Param('cardId') cardId: string, @Body() cardDetails: Partial<Card>) {
    return this.userAuthService.editCard(userId, cardId, cardDetails);
  }
  @Get(':userId/cards')
  async getCards(@Param('userId') userId: string) {
    return this.userAuthService.getCards(userId);
  }

  //Favorites
  @Post('add-to-favourites')
  async addToFavourites(
    @Body() addToFavouritesDTO: addToFavouritesDTO,
    @Res() res: Response
  ) {
    const result = await this.userAuthService.addToFavourites(addToFavouritesDTO);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  }
  @Get('favorites/:userId')
  async getFavorites(@Param('userId') userId: string) {
      try {
          const reviews = await this.userAuthService.getUserFavorites(userId);
          return { success: true, reviews };
      } catch (error) {
          if (error instanceof HttpException) {
              throw error;
          }
          throw new HttpException('Unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  //Reviews
  @Post('reviews/:userId')
  async createReview(@Param('userId') userId: string, @Body() reviewData: Reviews) {
      try {
          const newReview = await this.userAuthService.createReview(userId, reviewData);
          return { success: true, message: 'Review added successfully', review: newReview };
      } catch (error) {
          throw new HttpException(Error, HttpStatus.BAD_REQUEST);
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
        throw new HttpException(Error, HttpStatus.BAD_REQUEST);
    }
  }
  @Put('reviews/:userId/:reviewId')
  async editReview(@Param('userId') userId: string, @Param('reviewId') reviewId: string, @Body() updateData: { content?: string, rating?: number }) {
    try {
        const updatedReview = await this.userAuthService.editReview(userId, reviewId, updateData);
        return { success: true, message: 'Review updated successfully', review: updatedReview };
    } catch (error) {
        throw new HttpException(Error, HttpStatus.BAD_REQUEST);
    }
}


}
>>>>>>> 76dceef4bcc12aff7b1c330a4d70d06ae2cf0908

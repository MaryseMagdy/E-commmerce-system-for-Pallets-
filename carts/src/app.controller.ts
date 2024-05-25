import { Body, Controller, Post, Req, UnauthorizedException, Res, Get, Param, HttpStatus, InternalServerErrorException, Patch } from '@nestjs/common';
import { CartService } from './app.service';
import { Request, Response } from 'express';
import { AddToCartDto } from './dto/addToCart.dto';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt, Strategy } from "passport-jwt";
import { MessagePattern } from '@nestjs/microservices';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService,
    private readonly jwtService: JwtService 
  ) {
    console.log("cart controller check")
    const extractJwt = ExtractJwt.fromAuthHeaderAsBearerToken();
    console.log("Extracted Token:", ExtractJwt.fromAuthHeaderAsBearerToken());  
  }

  // @Post('/addToCart')
  // async addToCart(@Req() req: Request, @Res() res: Response, @Body() addToCartDto: AddToCartDto) {
  //   const jwt = req.cookies['jwt']; 
  //   console.log("JWT from cookies:", jwt);
  //   if (!jwt) {
  //     return res.status(401).send('Unauthorized');
  //   }
  //   console.log("JWT from cookies:", jwt); 
  //   try {
  //     const decoded = this.jwtService.verify(jwt); 
  //     console.log("Decoded JWT:", decoded);

  //     // Fetch product details from the product service via Kafka
  //     const productDetails = await this.cartService.fetchProductDetails(addToCartDto.productId);
  //     if (!productDetails) {
  //       throw new InternalServerErrorException('Failed to fetch product details');
  //     }

  //     const cartItem = await this.cartService.addToCart(decoded.userId, { ...addToCartDto, name: productDetails.name, price: productDetails.price });

  //     return res.json({ success: true, message: 'Item added successfully', cartItem });
  //   } catch (error) {
  //     console.error("JWT Verification Error:", error);
  //     return res.status(401).send('Unauthorized due to invalid token');
  //   }
  // }

  // @Get('/:userId')
  // @MessagePattern('get_user_cart')
  // async getUserCart(@Req() req: Request, @Param('userId') userId: string, @Res() res: Response) {
  //   const jwt = req.cookies['jwt']; 
  //   console.log("JWT from cookies:", jwt);
  //   if (!jwt) {
  //     return res.status(401).send('Unauthorized');
  //   }
  //   try {
  //     const decoded = this.jwtService.verify(jwt); 
  //     console.log("Decoded JWT of get usercart:", decoded); 
  //     const cartItems = await this.cartService.getUserCart(userId);

  //     if (!cartItems.length) {
  //       return res.status(HttpStatus.NOT_FOUND).json({
  //         status: 'error',
  //         message: 'No cart items found for this user.'
  //       });
  //     }

  //     return res.status(HttpStatus.OK).json({
  //       status: 'success',
  //       data: cartItems,
  //       message: 'Cart items retrieved successfully.'
  //     });
  //   } catch (error) {
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       status: 'error',
  //       message: 'Failed to retrieve cart items.',
  //       error: error.message
  //     });
  //   }
  // } 
  @Post('add')
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @Get(':userId')
  async getUserCart(@Param('userId') userId: string) {
    return this.cartService.getUserCart(userId);
  }
 
}
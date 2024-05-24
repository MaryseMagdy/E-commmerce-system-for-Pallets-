import { Controller, Post, Param, HttpCode, HttpStatus, Res, Body, Get } from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from './app.service';
import { Types } from 'mongoose';
import { OrdersDTO } from './dto/orders.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('/placeOrder/:userId')
    @HttpCode(HttpStatus.OK)
    async placeOrder(@Param('userId') userId: string, @Body() cartItems: { productId: string; quantity: number; price: number; }[], @Res() res: Response) {
        try {
            console.log("Received cartItems in controller:", cartItems);

            const order = await this.orderService.placeOrder(userId, cartItems);
            
            return res.json({
                status: 'success',
                data: order,
                message: 'Order placed successfully'
            });
        } catch (error) {
            console.error('Error placing order:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to place order'
            });
        }
    }
   
    @Get('/:userId')
    @HttpCode(HttpStatus.OK)
    async getOrders(@Param('userId') userId: string, @Res() res: Response) {
        try {
            const orders = await this.orderService.getOrders(userId);
            return res.json({
                status: 'success',
                data: orders,
                message: 'Orders fetched successfully'
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to fetch orders'
            });
        }
    }
}

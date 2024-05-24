import { Injectable, OnModuleInit, OnModuleDestroy, InternalServerErrorException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './interfaces/carts';
import { AddToCartDto } from './dto/addToCart.dto';
import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';

@Injectable()
export class CartService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;
  private consumer: Consumer;
  private productDetails: { [key: string]: { name: string; price: number } } = {};

  constructor(@Inject('carts_Model') private readonly cartModel: Model<Cart>) {
    const kafka = new Kafka({
      clientId: 'cart-service',
      brokers: ['localhost:9092'],
      logLevel: logLevel.INFO,
    });
    this.producer = kafka.producer();
    this.consumer = kafka.consumer({ groupId: 'cart-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'cart-product-response' });
    

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value.toString());
          if (topic === 'cart-product-response') {
            const { userId, productId, name, price, quantity } = data;
            console.log(userId, productId, name, price, quantity)
            console.log(data)
            await this.addToCartHandler(new AddToCartDto(userId, productId, quantity, name, price));
          }
        } catch (error) {
          console.error('Error processing product details response:', error);
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  } 
  private async requestProductDetails(productId: string, userId: string, quantity: number) {
    await this.producer.send({
      topic: 'cart-product-details',
      messages: [{ value: JSON.stringify({ productId, userId, quantity }) }],
    });
  }

  private async addToCartHandler(addToCartDto: AddToCartDto) {
    const { userId, productId, quantity, name, price } = addToCartDto;

    const cartItem = new this.cartModel({
      userId,
      productId,
      quantity,
      name,
      price,
    });
    console.log("cartItem",cartItem)

    await cartItem.save();

    await this.producer.send({
      topic: 'cart-to-user',
      messages: [{ value: addToCartDto.toString() }],
    });

    return cartItem;
  }

  async addToCart(addToCartDto: AddToCartDto): Promise<any> {
    await this.requestProductDetails(addToCartDto.productId, addToCartDto.userId, addToCartDto.quantity);
  }

  async getUserCart(userId: string): Promise<Cart[]> {
    try {
      const userCartItems = await this.cartModel.find({ userId }).exec();
      return userCartItems;
    } catch (error) {
      console.error('Error getting user cart:', error);
      throw new InternalServerErrorException('Server error');
    }
  }
}
import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from './interfaces/product';
import { Kafka } from 'kafkajs';
import { productDTO } from './dto/product.dto';
import { Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { customizeDTO } from './dto/customize.dto';


@Injectable()
export class ProductService {
  private kafka: Kafka;
  private producer;
  private consumer;
  
  constructor(
    @Inject('product_Model') // Ensure the injection token is correct
    private readonly productModel: Model<Product>,
  ) {
    this.kafka = new Kafka({
      clientId: 'product-service',
      brokers: ['localhost:9092']
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'product-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async startConsumer() {
    await this.consumer.subscribe({ topic: 'product-rating' });
  
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
          const messageValue = message.value.toString();
          console.log('Raw message:', messageValue); // Log raw message
          try {
              const parsedMessage = JSON.parse(messageValue);
              console.log('Parsed message:', parsedMessage); // Log parsed message
              const { productId, rating } = parsedMessage;
              console.log('Extracted rating:', rating); // Log extracted rating
              if (topic === 'product-rating') {
                  await this.rateProduct(productId, rating);
                  console.log('Product rated', parsedMessage);
              }
          } catch (error) {
              console.error('Error parsing message:', error);
          }
      },
  });
}
  async rateProduct(productId: string, rating: number) {
      console.log('Rating:', rating); // Log the rating value
      const product = await this.productModel.findById(productId);
      if (!product) {
          throw new Error('Product not found');
      }
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
          throw new Error('Invalid rating. Rating must be a number between 1 and 5.');
      }
  
      product.ratings.push(rating);
      console.log('Product ratings:', product.ratings);
  
      // Calculate the new average rating
      const totalRatings = product.ratings.reduce((sum, rate) => sum + rate, 0);
      const averageRating = totalRatings / product.ratings.length;
      product.rating = averageRating;
  
      await product.save();
      console.log('Product rated', product);
      return product;
  }
    
  

  async getProductById(id: string) {
    let productinfo = await this.productModel.findById(id);
    console.log(productinfo?.toObject());
    console.log(productinfo, "asdftyguh");

    if (!productinfo) {
      return null; // or throw NotFoundException
    }

    let jsonData = productinfo.toObject();
    let { _id, ...productData } = jsonData;

    return {
      _id: jsonData._id,
      ...productData,
    };
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.productModel.find();
    } catch (error) {
      throw new Error('Failed to fetch products: ' + (error as Error).message);
    }
  }
  
  async createProduct(productDTO: productDTO) {
    try {
      const newProduct = new this.productModel(productDTO);
      const savedProduct = await newProduct.save();
      return savedProduct.toObject();
    } catch (error) {
      throw new Error('Failed to create product: ' + (error as Error).message);
    }
  }

  async customizeProduct(productId: string, customizationData: customizeDTO): Promise<Product> {
    try {
      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (product.customized) {
        throw new BadRequestException('Product is already customized');
      }

      product.color = customizationData.color;
      product.material = customizationData.material;
      product.width = customizationData.width;
      product.height = customizationData.height;
      product.quantity = customizationData.quantity
      product.customized = true;

      await product.save();
      console.log("bekh", product.toObject());
      return product.toObject();
    } catch (error) {
      throw new Error('Failed to customize product: ' + (error as Error).message);
    }
  }



  async searchProducts(@Body() requestBody: { letter: string }): Promise<Product[]> {
    try {
      const { letter } = requestBody;
      if (!letter || letter.length !== 1) {
        throw new BadRequestException('Query must be a single letter in the request body');
      }

      const products = await this.productModel.find({ name: { $regex: `^${letter}`, $options: 'i' } }).exec();
      return products;
    } catch (error) {
      throw new NotFoundException('Failed to fetch products: ' +  (error as Error).message);
    }
  }


}

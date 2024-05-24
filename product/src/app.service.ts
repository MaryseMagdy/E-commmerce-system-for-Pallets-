import { Injectable, Inject, NotFoundException, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Product } from './interfaces/product';
import { productDTO } from './dto/product.dto';
import { Body, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { customizeDTO } from './dto/customize.dto';
import { rentDTO } from './dto/rent.dto';
import { Kafka } from 'kafkajs';
import { Reviews } from './dto/reviews.dto';

@Injectable()
export class ProductService implements OnModuleInit, OnModuleDestroy {
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
    await this.subscribeToTopics();
    await this.startConsumer();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  private async subscribeToTopics() {
    await this.consumer.subscribe({ topic: 'product-rating' });
    await this.consumer.subscribe({ topic: 'get-product-details' });
    await this.consumer.subscribe({ topic: 'add-to-favourites' });
    await this.consumer.subscribe({ topic: 'cart-product-details' });


  }

  async startConsumer() {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value.toString();
        console.log('Raw message:', messageValue); // Log raw message
        try {
          const parsedMessage = JSON.parse(messageValue);
          const { userId, productId, rating } = parsedMessage;
          if (topic === 'product-rating') {
            await this.rateProduct(productId, rating);
          }
          if (topic === 'get-product-details') {
            const product = await this.productModel.findById(productId).lean();
            if (!product) {
              return;
            }
            const productDetails = {
              _id: product._id,
              name: product.name,
              price: product.price,
              description: product.description,
              color: product.color,
              material: product.material,
              image: product.image,
              width: product.width,
              height: product.height,
              rating: product.rating,
              userId: userId, // Include userId to identify the user
            };
            console.log('Product details:', productDetails); // Log product details
            await this.producer.send({
              topic: 'product-details-response',
              messages: [{ value: JSON.stringify(productDetails) }],
            });
          }
          if (topic === 'cart-product-details') {
            const product = await this.productModel.findById(productId).lean();
            if (!product) {
              return;
            }
            const productDetails = {
              productId: product._id,
              name: product.name,
              price: product.price,
              userId,
              quantity:3
            };
            console.log('Product details:', productDetails);
            await this.producer.send({
              topic: 'cart-product-response',
              messages: [{ value: JSON.stringify(productDetails) }],
            });
          }      
          if (topic === 'add-to-favourites') {
              const product = await this.productModel.findById(productId).lean();
              if (!product) {
                return;
              }
              const productDetails = {
                _id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                color: product.color,
                material: product.material,
                image: product.image,
                width: product.width,
                height: product.height,
                rating: product.rating,
                userId: userId
              };
              console.log('Add to favourites - Product details:', productDetails); // Log product details
              await this.producer.send({
                topic: 'add-to-favourites-response',
                messages: [{ value: JSON.stringify(productDetails) }],
              });
            }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      },
    });
  }

  async sendProductDetailsToCart(productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productDetails = {
      productId: product._id,
      name: product.name,
      price: product.price,
    };

    await this.producer.send({
      topic: 'cart-product-details',
      messages: [{ value: JSON.stringify(productDetails) }],
    });

    console.log('Product details sent to cart', productDetails);
  }
  async rateProduct(productId: string, rating: number) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      throw new Error('Invalid rating. Rating must be a number between 1 and 5.');
    }

    product.ratings.push(rating);

    const totalRatings = product.ratings.reduce((sum, rate) => sum + rate, 0);
    const averageRating = totalRatings / product.ratings.length;
    product.rating = averageRating;

    await product.save();
    return product;
  }

  async rentOrder(productId: string, rentOrderDTO: rentDTO): Promise<Product> {
    try {
      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const { rentStartDate, rentEndDate } = rentOrderDTO;
      const start = new Date(rentStartDate);
      const end = new Date(rentEndDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format');
      }

      if (end <= start) {
        throw new Error('End date must be after start date');
      }
      console.log(start, end);

      const rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      console.log(rentalDays);
      const deposit = product.deposit || 50; // Fixed deposit amount, or you can store it in the product model
      console.log(deposit, 'deposit');

      const totalPrice = rentalDays + deposit;
      console.log(totalPrice, 'total');

      product.rentStartDate = start;
      product.rentEndDate = end;
      product.totalRentalPrice = totalPrice; // Assuming you store the total rental price in the product model
      console.log(product);
      await product.save();

      return product;
    } catch (error) {
      throw new Error('Failed to place rent order: ' + (error as Error).message);
    }
  }

  async orderNow(productId: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (!product.availability) {
        throw new Error('Product not available');
      }

      product.availability = false;

      await product.save();

      return product;
    } catch (error) {
      throw new Error('Failed to place order: ' + (error as Error).message);
    }
  }

  async getProductById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product.toObject();
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
      const productObject = product.toObject();

      const customizedProductData = new this.productModel({
        ...productObject, // Copy existing product properties
        _id: undefined, // Ensure a new product ID is generated
        color: customizationData.color,
        material: customizationData.material,
        width: customizationData.width,
        height: customizationData.height,
        quantity: customizationData.quantity,
        customized: true,
        originalProductId: productId, // Optional: Reference to the original product
      });
      const customizedProduct = new this.productModel(customizedProductData);

      await customizedProduct.save();

      return customizedProduct.toObject();
    } catch (error) {
      throw new Error('Failed to customize product: ' + (error as Error).message);
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.length < 1) {
      throw new BadRequestException('Query must be at least one character in the request body');
    }

    const products = await this.productModel.find({ 
      name: { $regex: query, $options: 'i' },
      customized: false
    }).exec();
    return products;
  }
  async getReviews(productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }else{

        return product.reviews;
    }
  }
  async createReview(productId: string, reviewData: Reviews) {
    const product = await this.productModel.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }
    if (!mongoose.Types.ObjectId.isValid(reviewData.userId)) {
        throw new Error('Invalid UserId');
    }

    const review = {
        productId: product._id as mongoose.Types.ObjectId,
        userId: new mongoose.Types.ObjectId(reviewData.userId),
        content: reviewData.content,
        rating: reviewData.rating,
    };

    product.reviews.push(review);
    await product.save();
    return { success: true, review: product.reviews[product.reviews.length - 1] };
}

}

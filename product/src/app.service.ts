import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Product } from '../src/interfaces/product'; // Assuming the correct path

@Injectable()
export class productService { // Corrected class name
  getHello(): string {
    return 'Hello World!';
  }

  constructor(
    @Inject('product_Model')
    private productModel: Model<Product>,
    private jwtService: JwtService,
  ) {}

  async getProductById(id: string) {
    let productinfo = await this.productModel.findById(id);
  
    if (!productinfo) {
        return null;
    }
  
    let jsonData = productinfo.toObject();
    let { _id, ...productData } = jsonData;
  
    return {
        id: jsonData._id,
        ...productData
    };
  }
  }


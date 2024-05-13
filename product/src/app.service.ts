import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {Product} from './interfaces/product';
@Injectable()
export class AppService {     
    constructor(
        @Inject('Product_MODEL') private productModel: Model<Product>    ) {}

    //product apis
  }
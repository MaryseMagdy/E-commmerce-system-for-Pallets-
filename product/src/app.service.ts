import { Injectable, NotFoundException, BadRequestException, Body, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from '../src/interfaces/product';
import { productDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('product_Model')
    private readonly productModel: Model<Product>,
  ) {}

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

  async createProduct(productDTO: productDTO) {
    try {
      const newProduct = new this.productModel(productDTO);
      const savedProduct = await newProduct.save();
      return savedProduct.toObject();
    } catch (error) {
      throw new Error('Failed to create product: ' + (error as Error).message);
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel.find();
      console.log(products, "sdfghjkl;yuuiuopio['");
      const pr = products.map(product => product.toObject());
      console.log(pr, "sdfghjkl;");
      return (pr);
    } catch (error) {
      throw new Error('Failed to fetch products: ' + (error as Error).message);
    }
  }
  async customizeProduct(productId: string, customizationData: productDTO): Promise<Product> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.customized) {
      throw new BadRequestException('Product is already customized');
    }

    if (customizationData.customized) {
      product.color = customizationData.color;
      product.material = customizationData.material;
      product.size = customizationData.size;
      product.customized = true;

      await product.save();
    }

    return product.toObject();
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

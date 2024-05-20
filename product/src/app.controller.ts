import { Controller, Get, Post, Body, Delete, Put ,Param, NotFoundException, Query ,BadRequestException , InternalServerErrorException} from '@nestjs/common';
import { ProductService } from './app.service';
import { Product } from '../src/interfaces/product';
import { productDTO } from './dto/product.dto';
import { customizeDTO } from './dto/customize.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly ProductService: ProductService) {}

  @Get(':id')
async getProductById(@Param('id') id: string) {
  try {
    const product = await this.ProductService.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  } catch (error) {
    throw new NotFoundException('Product not found: ' +  (error as Error).message);
  }
}

@Post('/createProduct')
  async createProduct(@Body() productData: productDTO) {
    return this.ProductService.createProduct(productData);
  }

  @Get('/') // Adjust the endpoint as per your setup
  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await this.ProductService.getAllProducts();
      if (!products || products.length === 0) {
        throw new NotFoundException('No products found');
      }
      return products;
    } catch (error) {
      throw new NotFoundException('Failed to fetch products: ' + (error as Error).message);
    }
  }
  @Put(':productId/customize')
  async customizeProduct(
      @Param('productId') productId: string,
      @Body() customizationData: customizeDTO,
  ) {
      try {
          const product = await this.ProductService.customizeProduct(productId, customizationData);
          return { success: true, product };
      } catch (error) {
          console.error('Error customizing product:', error);
          return { success: false, message: (error as Error).message };
      }
  }
  
  @Post('/search')
async searchProduct(@Body() body: { letter: string }): Promise<Product[]> {
  try {
    const { letter } = body;
    if (!letter || letter.length !== 1) {
      throw new BadRequestException('Query must be a single letter in the request body');
    }

    // Create an object with the 'letter' property
    const queryObject = { letter }; // or { letter: letter }

    // Pass the object to the service method
    const products = await this.ProductService.searchProducts(queryObject);
    if (!products || products.length === 0) {
      throw new NotFoundException('No products found matching the search query');
    }
    return products;
  } catch (error) {
    throw new NotFoundException('Failed to fetch products: ' + (error as Error).message);
  }
}

}
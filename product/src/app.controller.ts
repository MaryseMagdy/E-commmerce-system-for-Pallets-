import { Controller, Get, Post, Body, Delete, Put ,Param, NotFoundException, Query ,BadRequestException , InternalServerErrorException} from '@nestjs/common';
import { ProductService } from './app.service';
import { Product } from '../src/interfaces/product';
import { productDTO } from './dto/product.dto';
import { customizeDTO } from './dto/customize.dto';
import { rentDTO } from './dto/rent.dto';
import { Reviews } from './dto/reviews.dto';

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
  @Get('/material/:material')
  async getProductsByMaterial(@Param('material') material: string): Promise<Product[]> {
    try {
      const products = await this.ProductService.findByMaterial(material);
      if (!products || products.length === 0) {
        throw new NotFoundException(`No products found with material: ${material}`);
      }
      return products;
    } catch (error) {
      throw new NotFoundException('Failed to fetch products: ' + (error as Error).message);
    }
  }
  @Post('rent/:productId')
  async rentOrder(
    @Param('productId') productId: string,
    @Body() rentOrderDTO: rentDTO
  ) {
    try {
      const product = await this.ProductService.rentOrder(productId, rentOrderDTO);
      return { success: true, product };
    } catch (error) {
      throw new InternalServerErrorException('Failed to place rent order: ' + (error as Error).message);
    }
  }
  // @Post('/search')
  // async searchProduct(@Body() body: { query: string }): Promise<Product[]> {
  //     try {
  //         const { query } = body;
  //         if (!query || query.length < 1) {
  //             throw new BadRequestException('Query must be at least one character in the request body');
  //         }

  //         const products = await this.ProductService.searchProducts(query);
  //         if (!products || products.length === 0) {
  //             throw new NotFoundException('No products found matching the search query');
  //         }
  //         return products;
  //     } catch (error) {
  //         throw new NotFoundException('Failed to fetch products: ' + (error as Error).message);
  //     }
  // }
  @Post('/search')
  async searchProduct(@Body() body: { query: string }): Promise<Product[]> {
    const { query } = body;
    if (!query || query.length < 1) {
        throw new BadRequestException('Query must be at least one character in the request body');
    }

    const products = await this.ProductService.searchProducts(query);
    return products;
} 
@Get(':productId/reviews')
  async getReviews(@Param('productId') productId: string) {
    try {
      const reviews = await this.ProductService.getReviews(productId);
      return reviews;
    } catch (error) {
      throw new NotFoundException( (error as Error).message);
    }
  }
  @Post(':productId/reviews')
  async createReview(
      @Param('productId') productId: string,
      @Body() createReviewDto: Reviews,
  ) {
      createReviewDto.productId = productId;
      return this.ProductService.createReview(productId, createReviewDto);
  }
  @Post(':id/sendToCart')
  async sendProductDetailsToCart(@Param('id') productId: string) {
    await this.ProductService.sendProductDetailsToCart(productId);
    return { message: 'Product details sent to cart' };
  }
}
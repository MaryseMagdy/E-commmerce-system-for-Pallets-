import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { productService } from './app.service'; // Corrected import

@Controller('product')
export class productController {
  constructor(private readonly productService: productService) {}

  @Get('getHello') // Added route decorator
  getHello(): string {
    return this.productService.getHello();
  }

  @Get('/getProductById/:id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
    
    
  }
}

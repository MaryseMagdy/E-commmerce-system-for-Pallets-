import { Controller, Get } from '@nestjs/common';
import { productService } from './app.service';

@Controller()
export class productController {
  constructor(private readonly appService: productService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

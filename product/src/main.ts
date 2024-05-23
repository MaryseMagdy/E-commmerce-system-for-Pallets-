import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductService } from './app.service';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const productService = app.get(ProductService);

  // await productService.startConsumer();
  
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(8000);
}
bootstrap();

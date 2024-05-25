import { NestFactory } from '@nestjs/core';
<<<<<<< HEAD
import { ProductModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  await app.listen(4000);
=======
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
>>>>>>> 76dceef4bcc12aff7b1c330a4d70d06ae2cf0908
}
bootstrap();

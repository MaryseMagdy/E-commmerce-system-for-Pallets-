import { NestFactory } from '@nestjs/core';
import { ProductModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  await app.listen(4000);
}
bootstrap();

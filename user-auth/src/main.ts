import { NestFactory } from '@nestjs/core';
import { userAuthModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(userAuthModule);
  await app.listen(4000);
}

bootstrap();

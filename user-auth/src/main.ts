import { NestFactory } from '@nestjs/core';
import { userAuthModule } from '../src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(userAuthModule);
  await app.listen(3000);
}
bootstrap();

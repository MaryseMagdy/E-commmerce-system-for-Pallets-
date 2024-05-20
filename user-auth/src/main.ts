import { NestFactory } from '@nestjs/core';
import { userAuthModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(userAuthModule);
  app.use(cookieParser());

  const jwtService = app.get(JwtService);
  const configService = app.get(ConfigService);
  app.use((req, res, next) => {
    const token = req.cookies.jwt; // Extract token from cookies
    if (token) {
      try {
        const decoded = jwtService.verify(token, { secret: configService.get<string>('JWT_SECRET') });
        req.user = decoded;
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
    next();
  });

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(8001);
}
bootstrap();

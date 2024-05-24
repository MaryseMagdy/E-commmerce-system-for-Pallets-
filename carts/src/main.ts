import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Kafka } from 'kafkajs';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { CartService } from './app.service';

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    const cartServie = app.get(CartService);

    app.use(cookieParser());
    
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    await app.listen(8004);
}

bootstrap();
// const kafka = new Kafka({
//     clientId: 'cart-service',
//     brokers: ['localhost:9092']
// });
// const producer = kafka.producer();
// await producer.connect();

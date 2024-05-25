// // order/main.ts
import { NestFactory } from '@nestjs/core';
import { orderModule } from './app.module';
import { Kafka } from 'kafkajs';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser'
import { OrderService } from './app.service';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(orderModule);
  const orderService = app.get(OrderService);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  await app.listen(8003);
  console.log('Order service listening at http://localhost:8003');
}

bootstrap();


// //   const orderService = app.get(OrderService);
// //   await orderService.startConsumer();

//   app.connectMicroservice({
//     transport: Transport.KAFKA,
//     options: {
//         client: {
//             brokers: ['localhost:9092'],
//         },
//         consumer: {
//             groupId: 'orderConsumer',
//         },
//     },
// });
//  await app.startAllMicroservices();


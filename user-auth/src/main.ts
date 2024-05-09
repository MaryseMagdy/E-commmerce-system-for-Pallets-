// import { NestFactory } from '@nestjs/core';
// import { userAuthModule } from './app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice<MicroserviceOptions>(userAuthModule,{
//     transport: Transport.KAFKA,
//     options:{
//       client:{
//         brokers:['localhost:9092'],
//       },
//       consumer:{
//         groupId:'auth-consumer',
//       }
//     }
//   });
//  app.listen();
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { userAuthModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(userAuthModule);
  await app.listen(3000);
}
bootstrap();
import { NestFactory } from '@nestjs/core';
import { productModule} from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(productModule,{
    transport: Transport.KAFKA,
    options:{
      client:{
        brokers:['localhost:9092'],
      },
      consumer:{
        groupId:'product-consumer',
      }
    }
  });
 app.listen();
}
bootstrap();
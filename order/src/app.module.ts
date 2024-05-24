import { Module } from '@nestjs/common';
import { OrderController } from './app.controller';
import { OrderService } from './app.service';
import { databaseProviders } from './database/database.providers';
import { orderprovider } from './database/order';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema} from './schemas/order.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name:'cart-service',
    //     transport:Transport.KAFKA,
    //     options:{
    //       client:{
    //         clientId:'cartId',
    //         brokers:['localhost:9092']
    //       },
    //       consumer:{
    //         groupId:'cart-consumer',
    //       }
    //     }
    //   }
    // ]),

    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/SE-Project2'),
    
  ],
 
  controllers: [OrderController],
  providers: [OrderService, 
    ...databaseProviders,
    ...orderprovider,],
})
export class orderModule {}

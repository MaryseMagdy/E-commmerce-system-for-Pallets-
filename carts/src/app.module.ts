// app.module.ts
import { Module } from '@nestjs/common';
import { CartService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import{CartSchema} from './schemas/carts.schema';
import{CartController} from './app.controller';
import { cartsprovider } from './database/carts';
import { JwtService } from '@nestjs/jwt';
import { databaseProviders } from './database/database.provider';
@Module({
  imports: [
  //   ClientsModule.register([
  //     {
  //       name:'userAuth_SERVICE',
  //       transport:Transport.KAFKA,
  //       options:{
  //         client:{
  //           clientId:'auth',
  //           brokers:['localhost:9092']
  //         },
  //         consumer:{
  //           groupId:'auth-consumer',
  //         }
  //       }
  //     }
  //   ],
  // ),
    MongooseModule.forFeature([
      { name: 'cart', schema: CartSchema },
    ]),
    
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/SE-Project2'), 
   ],
  controllers: [CartController],
  providers: [
    JwtService,
    ...databaseProviders,
    CartService,
    ...cartsprovider,
  ],
})
export class AppModule {}
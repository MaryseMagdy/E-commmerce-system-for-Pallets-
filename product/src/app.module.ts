// app.module.ts
import { Module } from '@nestjs/common';
import { ProductService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import{ProductSchema} from './schemas/product.schema';
import{ProductController} from './app.controller';
import { productsprovider } from './database/products';
import { JwtService } from '@nestjs/jwt';
import { databaseProviders } from './database/database.providers';
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
      { name: 'product', schema: ProductSchema },
    ]),
    
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/SE-Project2'), 
   ],
  controllers: [ProductController],
  providers: [
    JwtService,
    ...databaseProviders,
    ProductService,
    ...productsprovider,
  ],
})
export class AppModule {}
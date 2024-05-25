// app.module.ts
import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { productService } from './app.service'; // Corrected import
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { productController } from './app.controller'; // Corrected import
import { productProvider } from './database/products';
import { JwtModule } from '@nestjs/jwt'; // Removed JwtService
import { databaseProviders } from './database/database.providers';

@Module({
  imports: [
    ClientsModule.register([
      {
        name:'USER_AUTH_SERVICE',
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:'user-auth',
            brokers:['localhost:9092']
          },
          consumer:{
            groupId:'user-auth-consumer',
          }
        }
      }
    ]),
    MongooseModule.forFeature([
      { name: 'product', schema: ProductSchema },
    ]),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/SE-Project2'),
    JwtModule.register({}), // Register JwtModule for configuration
  ],
  controllers: [productController], // Corrected controller name
  providers: [
    productService, // Corrected service name
    ...databaseProviders,
    ...productProvider,
  ],
})
export class ProductModule {} // Corrected module name
=======
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
>>>>>>> 76dceef4bcc12aff7b1c330a4d70d06ae2cf0908

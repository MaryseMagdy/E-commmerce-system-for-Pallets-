import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ClientsModule.register([
      {
        name:'userAuth_SERVICE',
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:'auth',
            brokers:['localhost:9092']
          },
          consumer:{
            groupId:'auth-consumer',
          }
        }
      }
    ]),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/SE-Project2'), 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
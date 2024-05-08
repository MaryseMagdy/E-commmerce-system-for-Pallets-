
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { userAuthController } from './app.controller';
import { userAuthService } from './app.service';
import { UserAuthSchema } from './schemas/users.schema';
import { userAuthprovider } from './database/user-auth.provider';
import { databaseProviders } from './database/database.provider';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
  
@Module({
  imports: [
    ClientsModule.register([
      {
        name:'ORDER_SERVICE',
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:'order',
            brokers:['localhost:9092']
          },
          consumer:{
            groupId:'order-consumer',
          }
        }
      },
    ]),
    MongooseModule.forFeature([
      { name: 'users', schema: UserAuthSchema },
    ]),
    JwtModule.register({
      secret: 'your-secret-key', 
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/SE-Project2'), ],
  controllers: [userAuthController],
  providers: [
    userAuthService,
    ...userAuthprovider,
    ...databaseProviders,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [...databaseProviders],
})
export class userAuthModule {}

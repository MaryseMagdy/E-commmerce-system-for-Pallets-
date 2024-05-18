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
import { PaymentModule } from '../../payment/src/app.module';
import { JwtService} 
from '@nestjs/jwt';
import { EmailService } from './email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'users', schema: UserAuthSchema },
    ]),
    JwtModule.register({
      secret: 'default_secret', 
      signOptions: { expiresIn: '1d' },
    }),
    ClientsModule.register([
      {
        name: 'USER_AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user-authClientId',
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'user-auth-consumer',
          }
        }
      }
    ]),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/SE-Project2'),
    PaymentModule,

  ],
  controllers: [userAuthController],
  providers: [
    userAuthService,
    ...userAuthprovider,
    ...databaseProviders,
    EmailService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [...databaseProviders],
})
export class userAuthModule {}
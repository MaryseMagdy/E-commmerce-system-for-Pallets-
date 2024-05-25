import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
<<<<<<< HEAD
=======
import { ConfigModule, ConfigService } from '@nestjs/config';
>>>>>>> 76dceef4bcc12aff7b1c330a4d70d06ae2cf0908
import { userAuthController } from './app.controller';
import { userAuthService } from './app.service';
import { UserAuthSchema } from './schemas/users.schema';
import { userAuthprovider } from './database/user-auth.provider';
import { databaseProviders } from './database/database.provider';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
<<<<<<< HEAD
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtService
  
 } from '@nestjs/jwt';
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
      { name: 'users', schema: UserAuthSchema },
    ]),
    JwtModule.register({
      secret: 'your-secret-key', 
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/SE-Project2'), ],
=======
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: 'users', schema: UserAuthSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/SE-Project2'),
  ],
>>>>>>> 76dceef4bcc12aff7b1c330a4d70d06ae2cf0908
  controllers: [userAuthController],
  providers: [
    userAuthService,
    ...userAuthprovider,
    ...databaseProviders,
<<<<<<< HEAD
=======
    EmailService,
>>>>>>> 76dceef4bcc12aff7b1c330a4d70d06ae2cf0908
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [...databaseProviders],
})
export class userAuthModule {}

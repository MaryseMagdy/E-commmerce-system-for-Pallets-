import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { userAuthController } from './app.controller';
import { userAuthService } from './app.service';
import { UserAuthSchema } from './schemas/users.schema';
import { userAuthprovider } from './database/user-auth.provider';
import { databaseProviders } from './database/database.provider';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
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

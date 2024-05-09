import { Test, TestingModule } from '@nestjs/testing';
import { userAuthController } from './app.controller';
import { userAuthService } from './app.service';

describe('AppController', () => {
  let appController: userAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [userAuthController],
      providers: [userAuthService],
    }).compile();

    appController = app.get<userAuthController>(userAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

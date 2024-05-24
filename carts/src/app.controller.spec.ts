import { Test, TestingModule } from '@nestjs/testing';
import { CartController} from './app.controller';
import { CartService } from './app.service';
import { expect } from '@jest/globals';

describe('AppController', () => {
  let appController: CartController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [CartService],
    }).compile();

    appController = app.get<CartController>(CartController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
     // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

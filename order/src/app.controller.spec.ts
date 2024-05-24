import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './app.controller';
import { OrderService } from './app.service';

describe('AppController', () => {
  let appController: OrderController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    }).compile();

    appController = app.get<OrderController>(OrderController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
     // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

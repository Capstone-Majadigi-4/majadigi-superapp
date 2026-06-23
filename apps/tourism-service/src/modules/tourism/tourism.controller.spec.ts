import { Test, TestingModule } from '@nestjs/testing';
import { TourismController } from './tourism.controller';

describe('TourismController', () => {
  let controller: TourismController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TourismController],
    }).compile();

    controller = module.get<TourismController>(TourismController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

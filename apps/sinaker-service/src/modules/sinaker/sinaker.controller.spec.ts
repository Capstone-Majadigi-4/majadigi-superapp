import { Test, TestingModule } from '@nestjs/testing';
import { SinakerController } from './sinaker.controller';

describe('SinakerController', () => {
  let controller: SinakerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SinakerController],
    }).compile();

    controller = module.get<SinakerController>(SinakerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

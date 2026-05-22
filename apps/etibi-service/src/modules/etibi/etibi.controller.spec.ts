import { Test, TestingModule } from '@nestjs/testing';
import { EtibiController } from './etibi.controller';

describe('EtibiController', () => {
  let controller: EtibiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtibiController],
    }).compile();

    controller = module.get<EtibiController>(EtibiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

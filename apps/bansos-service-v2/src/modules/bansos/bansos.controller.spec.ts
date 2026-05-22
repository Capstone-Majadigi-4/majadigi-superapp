import { Test, TestingModule } from '@nestjs/testing';
import { BansosController } from './bansos.controller';

describe('BansosController', () => {
  let controller: BansosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BansosController],
    }).compile();

    controller = module.get<BansosController>(BansosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

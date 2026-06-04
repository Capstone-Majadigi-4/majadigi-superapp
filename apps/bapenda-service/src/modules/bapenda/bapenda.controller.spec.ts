import { Test, TestingModule } from '@nestjs/testing';
import { BapendaController } from './bapenda.controller';

describe('BapendaController', () => {
  let controller: BapendaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BapendaController],
    }).compile();

    controller = module.get<BapendaController>(BapendaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

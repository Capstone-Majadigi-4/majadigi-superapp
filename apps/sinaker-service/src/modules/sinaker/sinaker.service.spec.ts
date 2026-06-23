import { Test, TestingModule } from '@nestjs/testing';
import { SinakerService } from './sinaker.service';

describe('SinakerService', () => {
  let service: SinakerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SinakerService],
    }).compile();

    service = module.get<SinakerService>(SinakerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

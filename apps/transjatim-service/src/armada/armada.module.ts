import { Module } from '@nestjs/common';
import { ArmadaService } from './armada.service';
import { ArmadaController } from './armada.controller';

@Module({
  controllers: [ArmadaController],
  providers: [ArmadaService],
})
export class ArmadaModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Armada } from './entities/armada.entity';
import { ArmadaService } from './armada.service';
import { ArmadaController } from './armada.controller';
import { ArmadaGateway } from './armada.gateway';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [TypeOrmModule.forFeature([Armada]),
  MetricsModule
],
  providers: [ArmadaService, ArmadaGateway],
  controllers: [ArmadaController],
})
export class ArmadaModule {}

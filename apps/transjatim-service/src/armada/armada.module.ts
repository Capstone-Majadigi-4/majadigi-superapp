import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Armada } from './entities/armada.entity';
import { ArmadaService } from './armada.service';
import { ArmadaController } from './armada.controller';
import { ArmadaGateway } from './armada.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Armada])],
  providers: [ArmadaService, ArmadaGateway],
  controllers: [ArmadaController],
})
export class ArmadaModule {}

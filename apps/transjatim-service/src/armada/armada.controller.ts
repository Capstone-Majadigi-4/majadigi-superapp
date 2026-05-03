import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ArmadaService } from './armada.service';
import { ArmadaGateway } from './armada.gateway';
import { UpdateLokasiDto } from './dto/update-lokasi.dto';

@Controller('armada')
export class ArmadaController {
  constructor(
    private readonly armadaService: ArmadaService,
    private readonly armadaGateway: ArmadaGateway,
  ) {}

  @Get('koridor/:koridorId')
  findByKoridor(@Param('koridorId', ParseUUIDPipe) koridorId: string) {
    return this.armadaService.findByKoridor(koridorId);
  }

  @Put(':id/lokasi')
  async updateLokasi(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLokasiDto,
  ) {
    const armada = await this.armadaService.updateLokasi(id, dto);

    // Broadcast ke semua WS client di koridor ini
    if (armada.koridor_id) {
      this.armadaGateway.broadcastLokasi(armada.koridor_id, armada);
    }

    return armada;
  }
}

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
import { success } from '../common/helpers/response.helper';

@Controller('transjatim/armada')
export class ArmadaController {
  constructor(
    private readonly armadaService: ArmadaService,
    private readonly armadaGateway: ArmadaGateway,
  ) {}

  @Get('koridor/:koridorId')
  async findByKoridor(@Param('koridorId', ParseUUIDPipe) koridorId: string) {
    const data = await this.armadaService.findByKoridor(koridorId);
    return success(data);
  }

  @Put(':id/lokasi')
  async updateLokasi(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLokasiDto,
  ) {
    const armada = await this.armadaService.updateLokasi(id, dto);
    if (armada.koridor_id) {
      this.armadaGateway.broadcastLokasi(armada.koridor_id, armada);
    }
    return success(armada, 'Lokasi berhasil diupdate');
  }
}

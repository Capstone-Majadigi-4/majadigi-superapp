import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AcaraService } from './acara.service';
import { CreateAcaraDto, UpdateAcaraDto } from './dto/create-acara.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { success } from '../common/helpers/response.helper';

@Controller('islamic/admin/acara')
@UseGuards(AdminGuard)
export class AcaraAdminController {
  constructor(private readonly acaraService: AcaraService) {}

  @Post()
  async create(
    @Body() dto: CreateAcaraDto,
    @Headers('x-admin-nik') adminNik: string,
  ) {
    const data = await this.acaraService.create(dto, adminNik ?? 'admin');
    return success(data, 'Acara berhasil dibuat', 201);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAcaraDto,
  ) {
    const data = await this.acaraService.update(id, dto);
    return success(data, 'Acara berhasil diupdate');
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.acaraService.remove(id);
    return success(null, 'Acara berhasil dibatalkan');
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { KendaraanService } from '../services/kendaraan.service';
import { AdminGuard } from '../../../common/guards/admin.guard';
import { CreateKendaraanNjkbDto } from '../dto/create-kendaraan-njkb.dto';
import { UpdateKendaraanNjkbDto } from '../dto/update-kendaraan-njkb.dto';
import { CariNjkbDto } from '../dto/cari-njkb.dto';

@Controller('bapenda')
export class KendaraanController {
  constructor(private readonly kendaraanService: KendaraanService) {}

  @Get('kendaraan/jenis')
  async getJenis() {
    return this.kendaraanService.getJenisKendaraan();
  }

  @Get('kendaraan/merk')
  async getMerk(@Query('jenis') jenis: string) {
    return this.kendaraanService.getMerkByJenis(jenis);
  }

  @Get('kendaraan/model')
  async getModel(@Query('merk') merk: string) {
    return this.kendaraanService.getModelByMerk(merk);
  }

  @Get('kendaraan/tipe')
  async getTipe(@Query('model') model: string) {
    return this.kendaraanService.getTipeByModel(model);
  }

  @Get('kendaraan/tahun')
  async getTahun(@Query('tipe') tipe: string) {
    return this.kendaraanService.getTahunByTipe(tipe);
  }

  @Post('kendaraan/njkb')
  async cariNjkb(@Body() dto: CariNjkbDto) {
    return this.kendaraanService.cariNjkb(dto);
  }

  // Admin Routes (Protected by AdminGuard)
  @UseGuards(AdminGuard)
  @Get('admin/kendaraan')
  async getAll() {
    return this.kendaraanService.findAll();
  }

  @UseGuards(AdminGuard)
  @Get('admin/kendaraan/:id')
  async getDetail(@Param('id') id: string) {
    return this.kendaraanService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Post('admin/kendaraan')
  async create(@Body() dto: CreateKendaraanNjkbDto) {
    return this.kendaraanService.create(dto);
  }

  @UseGuards(AdminGuard)
  @Patch('admin/kendaraan/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateKendaraanNjkbDto) {
    return this.kendaraanService.update(id, dto);
  }

  @UseGuards(AdminGuard)
  @Delete('admin/kendaraan/:id')
  async remove(@Param('id') id: string) {
    return this.kendaraanService.remove(id);
  }
}

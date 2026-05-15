import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Headers,
  ParseUUIDPipe,
  Query,
  UseGuards,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FasilitasService } from './fasilitas.service';
import { CreateFasilitasDto } from './dto/create-fasilitas.dto';
import { TolakBookingDto } from './dto/tolak-booking.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { success } from '../common/helpers/response.helper';
import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';

const fotoUpload = FileInterceptor('foto', {
  storage: memoryStorage(), // NOSONAR typescript:S5693
  limits: { fileSize: 5 * 1024 * 1024 }, // Maks 5MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return cb(
        new BadRequestException('Hanya file gambar yang diperbolehkan'),
        false,
      );
    }
    cb(null, true);
  },
});

@Controller('islamic/admin')
@UseGuards(AdminGuard)
export class FasilitasAdminController {
  constructor(private readonly fasilitasService: FasilitasService) {}

  @Post('fasilitas')
  @UseInterceptors(fotoUpload) // Gunakan interceptor di sini
  async createFasilitas(
    @Body() dto: CreateFasilitasDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true, // Wajib upload gambar
      }),
    )
    file: Express.Multer.File,
  ) {
    const data = await this.fasilitasService.createFasilitas(dto, file);
    return success(data, 'Fasilitas berhasil ditambahkan', 201);
  }

  @Get('booking')
  async findAllBooking(@Query('status') status?: string) {
    const data = await this.fasilitasService.findAllBooking(status);
    return success(data);
  }

  @Patch('booking/:id/approve')
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-admin-nik') adminNik: string,
  ) {
    const data = await this.fasilitasService.approveBooking(
      id,
      adminNik ?? 'admin',
    );
    return success(data, 'Booking disetujui');
  }

  @Patch('booking/:id/tolak')
  async tolak(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-admin-nik') adminNik: string,
    @Body() dto: TolakBookingDto,
  ) {
    const data = await this.fasilitasService.tolakBooking(
      id,
      adminNik ?? 'admin',
      dto,
    );
    return success(data, 'Booking ditolak');
  }
}

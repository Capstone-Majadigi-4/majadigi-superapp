import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  ParseUUIDPipe,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FasilitasService } from './fasilitas.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { success } from '../common/helpers/response.helper';
import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';

const dokumenUpload = FileInterceptor('dokumen', {
  storage: memoryStorage(), // NOSONAR typescript:S5693
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.match(/\/(pdf|jpg|jpeg|png)$/)) {
      return cb(
        new BadRequestException('Hanya file PDF dan gambar yang diperbolehkan'),
        false,
      );
    }
    cb(null, true);
  },
});

@Controller('islamic/fasilitas')
export class FasilitasController {
  constructor(private readonly fasilitasService: FasilitasService) {}

  @Get()
  async findAll() {
    const data = await this.fasilitasService.findAll();
    return success(data);
  }

  @Get('booking/saya')
  async riwayatSaya(@Headers('x-user-nik') userNik: string) {
    const data = await this.fasilitasService.riwayatSaya(userNik);
    return success(data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.fasilitasService.findOne(id);
    return success(data);
  }

  @Post(':id/booking')
  @UseInterceptors(dokumenUpload)
  async booking(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-nik') userNik: string,
    @Body() dto: CreateBookingDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const data = await this.fasilitasService.booking(id, userNik, dto, file);
    return success(data, 'Booking berhasil diajukan', 201);
  }
}

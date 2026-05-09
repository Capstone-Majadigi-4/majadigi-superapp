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
  UseInterceptors,
  UploadedFile,
  Logger,
  BadRequestException,
  ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AcaraService } from './acara.service';
import { CreateAcaraDto, UpdateAcaraDto } from './dto/create-acara.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { success } from '../common/helpers/response.helper';


const posterUpload = FileInterceptor('poster', {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    console.log('Mimetype yang diterima:', file.mimetype);

    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      return cb(
        new BadRequestException(
          `Hanya file gambar yang diperbolehkan. Tipe terdeteksi: ${file.mimetype}`,
        ),
        false,
      );
    }
    cb(null, true);
  },
});

@Controller('islamic/admin/acara')
@UseGuards(AdminGuard)
export class AcaraAdminController {
  private readonly logger = new Logger(AcaraAdminController.name);

  constructor(private readonly acaraService: AcaraService) {}

  @Post()
  @UseInterceptors(posterUpload)
  async create(
    @Body() dto: CreateAcaraDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Headers('x-user-nik') adminNik: string,
  ) {
    this.logger.log(
      `CREATE — admin: ${adminNik}, file: ${file.originalname}, dto: ${JSON.stringify(dto)}`,
    );
    const data = await this.acaraService.create(dto, adminNik, file);
    return success(data, 'Acara berhasil dibuat', 201);
  }

  @Put(':id')
  @UseInterceptors(posterUpload)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAcaraDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    this.logger.log(`UPDATE ${id} — file: ${file?.originalname ?? 'none'}`);
    const data = await this.acaraService.update(id, dto, file);
    return success(data, 'Acara berhasil diupdate');
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`DELETE ${id}`);
    await this.acaraService.remove(id);
    return success(null, 'Acara berhasil dibatalkan');
  }
}

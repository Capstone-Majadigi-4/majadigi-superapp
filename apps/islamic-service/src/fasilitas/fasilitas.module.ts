import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fasilitas } from './entities/fasilitas.entity';
import { BookingFasilitas } from './entities/booking.entity';
import { FasilitasService } from './fasilitas.service';
import { FasilitasController } from './fasilitas.controller';
import { FasilitasAdminController } from './fasilitas-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Fasilitas, BookingFasilitas])],
  providers: [FasilitasService],
  controllers: [FasilitasController, FasilitasAdminController],
})
export class FasilitasModule {}

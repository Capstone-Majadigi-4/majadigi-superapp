import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcaraModule } from './acara/acara.module';
import { PendaftaranModule } from './pendaftaran/pendaftaran.module';
import { FasilitasModule } from './fasilitas/fasilitas.module';

@Module({
  imports: [AcaraModule, PendaftaranModule, FasilitasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

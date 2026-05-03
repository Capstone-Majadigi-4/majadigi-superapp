import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcaraModule } from './acara/acara.module';
import { PendaftaranModule } from './pendaftaran/pendaftaran.module';

@Module({
  imports: [AcaraModule, PendaftaranModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

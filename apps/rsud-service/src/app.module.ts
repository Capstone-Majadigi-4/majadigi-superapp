import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntreanModule } from './antrean/antrean.module';
import { PoliModule } from './poli/poli.module';

@Module({
  imports: [AntreanModule, PoliModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

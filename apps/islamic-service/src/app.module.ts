import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcaraModule } from './acara/acara.module';

@Module({
  imports: [AcaraModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntreanModule } from './antrean/antrean.module';

@Module({
  imports: [AntreanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

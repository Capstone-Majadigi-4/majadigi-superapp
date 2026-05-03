import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { KoridorService } from './koridor.service';

@Controller('koridor')
export class KoridorController {
  constructor(private readonly koridorService: KoridorService) {}

  @Get()
  findAll() {
    return this.koridorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.koridorService.findOne(id);
  }
}

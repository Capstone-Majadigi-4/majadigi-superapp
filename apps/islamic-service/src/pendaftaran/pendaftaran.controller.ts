import { Controller } from '@nestjs/common';
import { PendaftaranService } from './pendaftaran.service';

@Controller('pendaftaran')
export class PendaftaranController {
  constructor(private readonly pendaftaranService: PendaftaranService) {}
}

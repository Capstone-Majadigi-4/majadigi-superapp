import { Injectable }
from '@nestjs/common';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class RuteService {
  async getRuteTransjatim(
    destinasiId: string,
  ) {
    return ResponseHelper.success(
      'Rute Transjatim berhasil diambil',
      {
        destinasi_id:
          destinasiId,

        halte_terdekat:
          'Terminal Joyoboyo',

        estimasi_waktu:
          '25 menit',

        rute: [
          'Halte A',
          'Halte B',
          'Halte C',
        ],

        tarif: 5000,
      },
    );
  }
}
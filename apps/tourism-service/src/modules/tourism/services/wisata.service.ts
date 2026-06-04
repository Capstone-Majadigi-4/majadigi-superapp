import { Injectable }
from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import { Destinasi }
from '../entities/destinasi.entity';

import { ResponseHelper }
from '../../../common/helpers/response.helper';

@Injectable()
export class WisataService {
  constructor(
    @InjectRepository(
      Destinasi,
    )
    private readonly destinasiRepository:
      Repository<Destinasi>,
  ) {}

  async getWisata(
    page = 1,
    limit = 10,
    kategori?: string,
    kota?: string,
    search?: string,
  ) {
    if (page < 1) {
      page = 1;
    }

    if (limit < 1) {
      limit = 10;
    }

    if (limit > 50) {
      limit = 50;
    }

    const query =
      this.destinasiRepository
        .createQueryBuilder(
          'destinasi',
        )

        .leftJoinAndSelect(
          'destinasi.foto',
          'foto',
        )

        .where(
          'destinasi.is_active = :isActive',
          {
            isActive: true,
          },
        );

    if (kategori) {
      query.andWhere(
        'destinasi.kategori = :kategori',
        {
          kategori,
        },
      );
    }

    if (kota) {
      query.andWhere(
        'LOWER(destinasi.kota) LIKE LOWER(:kota)',
        {
          kota: `%${kota}%`,
        },
      );
    }

    if (search) {
      query.andWhere(
        'LOWER(destinasi.nama) LIKE LOWER(:search)',
        {
          search: `%${search}%`,
        },
      );
    }

    query
      .orderBy(
        'destinasi.created_at',
        'DESC',
      )

      .skip(
        (page - 1) * limit,
      )

      .take(limit);

    const [
      destinasi,
      total,
    ] =
      await query.getManyAndCount();

    const result =
      destinasi.map(
        (item) => ({
          id: item.id,

          nama:
            item.nama,

          kategori:
            item.kategori,

          kota:
            item.kota,

          kab_kota:
            item.kab_kota,

          rating: Number(
            item.rating,
          ),

          harga_tiket: {
            dewasa: Number(
              item.tiket_dewasa,
            ),

            anak: Number(
              item.tiket_anak,
            ),
          },

          thumbnail:
            item.foto
              ?.sort(
                (a, b) =>
                  a.urutan -
                  b.urutan,
              )[0]?.url ??
            null,
        }),
      );

    return ResponseHelper.paginate(
      'Data destinasi berhasil diambil',

      result,

      {
        page,
        limit,
        total,

        totalPages:
          Math.ceil(
            total / limit,
          ),
      },
    );
  }

  async getDetailWisata(
    id: string,
  ) {
    const destinasi =
      await this.destinasiRepository.findOne(
        {
          where: {
            id,
            is_active: true,
          },

          relations: {
            foto: true,
          },
        },
      );

    if (!destinasi) {
      return ResponseHelper.error(
        'Destinasi tidak ditemukan',
        'NOT_FOUND',
        404,
      );
    }

    return ResponseHelper.success(
      'Detail destinasi berhasil diambil',
      {
        id: destinasi.id,

        nama:
          destinasi.nama,

        deskripsi:
          destinasi.deskripsi,

        kategori:
          destinasi.kategori,

        kota:
          destinasi.kota,

        kab_kota:
          destinasi.kab_kota,

        alamat:
          destinasi.alamat,

        koordinat: {
          lat: Number(
            destinasi.lat,
          ),

          lng: Number(
            destinasi.lng,
          ),
        },

        tiket: {
          dewasa: Number(
            destinasi.tiket_dewasa,
          ),

          anak: Number(
            destinasi.tiket_anak,
          ),
        },

        jam_operasional: {
          buka:
            destinasi.jam_buka,

          tutup:
            destinasi.jam_tutup,
        },

        fasilitas:
          destinasi.fasilitas,

        rating: Number(
          destinasi.rating,
        ),

        galeri:
          destinasi.foto
            .sort(
              (a, b) =>
                a.urutan -
                b.urutan,
            )
            .map((foto) => ({
              id: foto.id,

              url: foto.url,

              urutan:
                foto.urutan,
            })),
      },
    );
  }
}
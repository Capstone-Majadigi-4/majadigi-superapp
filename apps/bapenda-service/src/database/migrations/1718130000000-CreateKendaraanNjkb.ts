import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateKendaraanNjkb1718130000000 implements MigrationInterface {
  name = 'CreateKendaraanNjkb1718130000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bapenda"."kendaraan_njkb" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "jenis_kendaraan" character varying(50) NOT NULL,
        "merk" character varying(100) NOT NULL,
        "model" character varying(100) NOT NULL,
        "tipe" character varying(100) NOT NULL,
        "tahun" integer NOT NULL,
        "njkb" bigint NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_kendaraan_njkb_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "bapenda"."kendaraan_njkb"`);
  }
}

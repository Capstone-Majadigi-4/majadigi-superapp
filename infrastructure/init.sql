CREATE SCHEMA "auth";

CREATE SCHEMA "bapenda";

CREATE SCHEMA "bapok";

CREATE SCHEMA "islamic";

CREATE SCHEMA "rsud";

CREATE SCHEMA "darurat";

CREATE SCHEMA "wisata";

CREATE SCHEMA "bansos";

CREATE SCHEMA "etibi";

CREATE SCHEMA "sinaker";

CREATE SCHEMA "transjatim";

CREATE TABLE "auth"."users" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nik" varchar(16) UNIQUE NOT NULL,
  "nama" varchar(255) NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "no_hp" varchar(20),
  "alamat" text,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "auth"."refresh_tokens" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid NOT NULL,
  "token" text NOT NULL,
  "fcm_token" text,
  "expires_at" timestamp NOT NULL,
  "is_revoked" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "bapenda"."kendaraan" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nik_pemilik" varchar(16) NOT NULL,
  "nopol" varchar(20) UNIQUE NOT NULL,
  "merk" varchar(100),
  "tipe" varchar(100),
  "tahun" smallint,
  "warna" varchar(50),
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "bapenda"."tagihan_pajak" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "kendaraan_id" uuid NOT NULL,
  "periode" varchar(4) NOT NULL,
  "pokok_pkb" bigint DEFAULT 0,
  "denda" bigint DEFAULT 0,
  "adm_stnk" bigint DEFAULT 0,
  "total" bigint NOT NULL,
  "jatuh_tempo" date NOT NULL,
  "status" varchar(20) DEFAULT 'belum_bayar',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "bapenda"."transaksi_pembayaran" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "tagihan_id" uuid NOT NULL,
  "kode_bayar" varchar(50) UNIQUE NOT NULL,
  "metode" varchar(20),
  "bank_code" varchar(10),
  "total" bigint NOT NULL,
  "status" varchar(20) DEFAULT 'menunggu',
  "paid_at" timestamp,
  "expired_at" timestamp,
  "pg_reference" varchar(100),
  "tbpkp_url" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "bapenda"."kendaraan_njkb" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "jenis_kendaraan" varchar(50) NOT NULL,
  "merk" varchar(100) NOT NULL,
  "model" varchar(100) NOT NULL,
  "tipe" varchar(100) NOT NULL,
  "tahun" integer NOT NULL,
  "njkb" bigint NOT NULL,
  "created_at" timestamptz DEFAULT (now()),
  "updated_at" timestamptz DEFAULT (now())
);


CREATE TABLE "bapok"."komoditas" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nama" varchar(150) NOT NULL,
  "kategori" varchar(50),
  "satuan" varchar(20),
  "ikon_url" text,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "bapok"."pasar" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nama" varchar(150) NOT NULL,
  "kota" varchar(100),
  "lat" decimal(10,7),
  "lng" decimal(10,7),
  "is_active" boolean DEFAULT true
);

CREATE TABLE "bapok"."harga_harian" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "komoditas_id" uuid NOT NULL,
  "pasar_id" uuid NOT NULL,
  "harga" bigint NOT NULL,
  "tanggal" date NOT NULL,
  "input_oleh" varchar(16),
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "bapok"."price_alert" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_nik" varchar(16) NOT NULL,
  "komoditas_id" uuid NOT NULL,
  "tipe" varchar(20) NOT NULL,
  "nominal" bigint NOT NULL,
  "is_active" boolean DEFAULT true,
  "last_triggered_at" timestamp,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "islamic"."fasilitas" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nama" varchar(150) NOT NULL,
  "kapasitas" integer,
  "harga_per_hari" bigint DEFAULT 0,
  "deskripsi" text,
  "foto_url" text,
  "is_active" boolean DEFAULT true
);

CREATE TABLE "islamic"."acara" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "judul" varchar(255) NOT NULL,
  "deskripsi" text,
  "tanggal" date NOT NULL,
  "waktu_mulai" time,
  "waktu_selesai" time,
  "lokasi" varchar(255),
  "kuota_maksimal" integer NOT NULL,
  "kuota_terisi" integer DEFAULT 0,
  "poster_url" text,
  "status" varchar(20) DEFAULT 'aktif',
  "dibuat_oleh" varchar(16),
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "islamic"."booking_fasilitas" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "fasilitas_id" uuid NOT NULL,
  "user_nik" varchar(16) NOT NULL,
  "nama_acara" varchar(255),
  "tanggal_mulai" date NOT NULL,
  "tanggal_selesai" date NOT NULL,
  "estimasi_peserta" integer,
  "dokumen_url" text,
  "estimasi_biaya" bigint,
  "kode_bayar" varchar(50),
  "status" varchar(20) DEFAULT 'pending_review',
  "catatan_admin" text,
  "reviewed_by" varchar(16),
  "reviewed_at" timestamp,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "islamic"."pendaftaran_acara" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "acara_id" uuid NOT NULL,
  "user_nik" varchar(16) NOT NULL,
  "qr_payload" text,
  "status" varchar(20) DEFAULT 'valid',
  "daftar_at" timestamp DEFAULT (now())
);

CREATE TABLE "rsud"."poli" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nama" varchar(150) NOT NULL,
  "lantai" varchar(10),
  "is_active" boolean DEFAULT true
);

CREATE TABLE "rsud"."dokter" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nama" varchar(200) NOT NULL,
  "spesialis" varchar(150),
  "foto_url" text,
  "is_active" boolean DEFAULT true
);

CREATE TABLE "rsud"."jadwal_dokter" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "dokter_id" uuid NOT NULL,
  "poli_id" uuid NOT NULL,
  "hari" varchar(10) NOT NULL,
  "jam_mulai" time,
  "jam_selesai" time,
  "kuota_per_hari" integer DEFAULT 30
);

CREATE TABLE "rsud"."antrean" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_nik" varchar(16) NOT NULL,
  "poli_id" uuid NOT NULL,
  "dokter_id" uuid NOT NULL,
  "tanggal" date NOT NULL,
  "nomor_antrean" varchar(10) NOT NULL,
  "estimasi_jam" time,
  "qr_checkin" text,
  "fcm_token" text,
  "status" varchar(20) DEFAULT 'menunggu',
  "dipanggil_at" timestamp,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "rsud"."ruangan" (
  "id"        uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nama"      varchar(150) NOT NULL,
  "kelas"     varchar(50)  NOT NULL,
  "kapasitas" int          NOT NULL DEFAULT 0,
  "terisi"    int          NOT NULL DEFAULT 0,
  "is_active" boolean      NOT NULL DEFAULT true
);

CREATE TABLE "darurat"."instansi" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nama" varchar(200) NOT NULL,
  "kategori" varchar(50) NOT NULL,
  "nomor" varchar(30),
  "nomor_cepat" varchar(10),
  "kota" varchar(100),
  "provinsi" varchar(100) DEFAULT 'Jawa Timur',
  "aktif_24jam" boolean DEFAULT true,
  "is_active" boolean DEFAULT true
);

CREATE TABLE "darurat"."laporan_panic" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_nik" varchar(16) NOT NULL,
  "kategori" varchar(50) NOT NULL,
  "latitude" decimal(10,7),
  "longitude" decimal(10,7),
  "deskripsi" text,
  "dikirim_ke" varchar(200),
  "webhook_status" varchar(20),
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "wisata"."destinasi" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nama" varchar(255) NOT NULL,
  "deskripsi" text,
  "kategori" varchar(50),
  "kota" varchar(100),
  "kab_kota" varchar(100),
  "alamat" text,
  "lat" decimal(10,7),
  "lng" decimal(10,7),
  "tiket_dewasa" bigint DEFAULT 0,
  "tiket_anak" bigint DEFAULT 0,
  "jam_buka" time,
  "jam_tutup" time,
  "fasilitas" text[],
  "rating" decimal(3,1) DEFAULT 0,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "wisata"."foto_destinasi" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "destinasi_id" uuid NOT NULL,
  "url" text NOT NULL,
  "urutan" smallint DEFAULT 0,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "wisata"."tiket_pembelian" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "destinasi_id" uuid NOT NULL,
  "user_nik" varchar(16) NOT NULL,
  "tanggal_kunjungan" date NOT NULL,
  "jumlah_dewasa" smallint DEFAULT 1,
  "jumlah_anak" smallint DEFAULT 0,
  "total" bigint NOT NULL,
  "qr_payload" text,
  "status" varchar(20) DEFAULT 'valid',
  "digunakan_at" timestamp,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "bansos"."program" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nama" varchar(200) NOT NULL,
  "deskripsi" text,
  "periode" varchar(4) NOT NULL,
  "kuota" integer,
  "status" varchar(20) DEFAULT 'aktif',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "bansos"."penerima" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "program_id" uuid NOT NULL,
  "user_nik" varchar(16) NOT NULL,
  "nama" varchar(255),
  "nominal" bigint,
  "status_pencairan" varchar(20) DEFAULT 'diproses',
  "sp2d_at" timestamp,
  "bank_at" timestamp,
  "cair_at" timestamp,
  "via_bank" varchar(50),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "bansos"."pengumuman" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "judul" varchar(255) NOT NULL,
  "konten" text,
  "program_id" uuid,
  "dibuat_oleh" varchar(16),
  "aktif_dari" date,
  "aktif_sampai" date,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "etibi"."pertanyaan_skrining" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "teks" text NOT NULL,
  "bobot" smallint DEFAULT 1,
  "urutan" smallint NOT NULL,
  "is_active" boolean DEFAULT true
);

CREATE TABLE "etibi"."hasil_skrining" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_nik" varchar(16) NOT NULL,
  "skor" smallint NOT NULL,
  "kategori_risiko" varchar(20),
  "perlu_followup" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "etibi"."pasien_aktif" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_nik" varchar(16) UNIQUE NOT NULL,
  "nama" varchar(255),
  "fase_pengobatan" varchar(20),
  "tanggal_mulai" date NOT NULL,
  "tanggal_selesai" date,
  "jam_minum_obat" time NOT NULL,
  "faskes_id" varchar(50),
  "status" varchar(20) DEFAULT 'aktif',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "etibi"."log_konfirmasi" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "pasien_id" uuid NOT NULL,
  "tanggal" date NOT NULL,
  "dikonfirmasi" boolean DEFAULT false,
  "timestamp_konfirmasi" timestamp,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "sinaker"."profil_pencari" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_nik" varchar(16) UNIQUE NOT NULL,
  "ringkasan" text,
  "skill" text[],
  "pendidikan" jsonb,
  "pengalaman" jsonb,
  "portfolio_url" text,
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "sinaker"."perusahaan" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nama" varchar(255) NOT NULL,
  "industri" varchar(100),
  "kota" varchar(100),
  "logo_url" text,
  "verified" boolean DEFAULT false,
  "admin_nik" varchar(16),
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "sinaker"."lowongan" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "perusahaan_id" uuid NOT NULL,
  "judul" varchar(255) NOT NULL,
  "deskripsi" text,
  "kualifikasi" text[],
  "kota" varchar(100),
  "tipe_kerja" varchar(20),
  "gaji_min" bigint,
  "gaji_max" bigint,
  "deadline" date,
  "status" varchar(20) DEFAULT 'aktif',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "sinaker"."lamaran" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "lowongan_id" uuid NOT NULL,
  "user_nik" varchar(16) NOT NULL,
  "matching_score" smallint,
  "catatan" text,
  "portfolio_url" text,
  "status" varchar(30) DEFAULT 'terkirim',
  "updated_at" timestamp DEFAULT (now()),
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE IF NOT EXISTS "transjatim"."koridor" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "kode" varchar(20) UNIQUE NOT NULL,
  "nama" varchar(255) NOT NULL,
  "asal" varchar(150),
  "tujuan" varchar(150),
  "is_active" boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS "transjatim"."halte" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "koridor_id" uuid NOT NULL,
  "nama" varchar(200) NOT NULL,
  "urutan" smallint NOT NULL,
  "lat" decimal(10,7),
  "lng" decimal(10,7)
);

CREATE TABLE IF NOT EXISTS "transjatim"."armada" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "koridor_id" uuid,
  "kode_bus" varchar(20) UNIQUE,
  "kapasitas" smallint,
  "lat" decimal(10,7),
  "lng" decimal(10,7),
  "status" varchar(20) DEFAULT 'aktif',
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE IF NOT EXISTS "transjatim"."tiket" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_nik" varchar(16) NOT NULL,
  "koridor_id" uuid NOT NULL,
  "jumlah" smallint DEFAULT 1,
  "total" bigint NOT NULL,
  "qr_totp" text,
  "status" varchar(20) DEFAULT 'valid',
  "valid_sampai" timestamp NOT NULL,
  "digunakan_at" timestamp,
  "created_at" timestamp DEFAULT (now())
);

CREATE UNIQUE INDEX ON "auth"."users" ("nik");

CREATE INDEX ON "auth"."refresh_tokens" ("user_id");

CREATE UNIQUE INDEX ON "auth"."refresh_tokens" ("token");

CREATE INDEX ON "bapenda"."kendaraan" ("nik_pemilik");

CREATE UNIQUE INDEX ON "bapenda"."kendaraan" ("nopol");

CREATE INDEX ON "bapenda"."tagihan_pajak" ("kendaraan_id");

CREATE UNIQUE INDEX ON "bapenda"."tagihan_pajak" ("kendaraan_id", "periode");

CREATE UNIQUE INDEX ON "bapenda"."transaksi_pembayaran" ("kode_bayar");

CREATE INDEX ON "bapenda"."transaksi_pembayaran" ("tagihan_id");

CREATE INDEX ON "bapenda"."transaksi_pembayaran" ("status");

CREATE UNIQUE INDEX ON "bapok"."harga_harian" ("komoditas_id", "pasar_id", "tanggal");

CREATE INDEX ON "bapok"."harga_harian" ("tanggal");

CREATE INDEX ON "bapok"."harga_harian" ("komoditas_id");

CREATE INDEX ON "bapok"."harga_harian" ("komoditas_id", "tanggal");

CREATE INDEX ON "bapok"."price_alert" ("user_nik");

CREATE INDEX ON "bapok"."price_alert" ("komoditas_id");

CREATE UNIQUE INDEX ON "bapok"."price_alert" ("user_nik", "komoditas_id", "tipe");

CREATE INDEX ON "islamic"."acara" ("tanggal");

CREATE INDEX ON "islamic"."acara" ("status");

CREATE INDEX ON "islamic"."booking_fasilitas" ("user_nik");

CREATE INDEX ON "islamic"."booking_fasilitas" ("fasilitas_id");

CREATE INDEX ON "islamic"."booking_fasilitas" ("status");

CREATE INDEX ON "islamic"."booking_fasilitas" ("fasilitas_id", "tanggal_mulai", "tanggal_selesai");

CREATE UNIQUE INDEX ON "islamic"."pendaftaran_acara" ("acara_id", "user_nik");

CREATE INDEX ON "islamic"."pendaftaran_acara" ("acara_id");

CREATE UNIQUE INDEX ON "rsud"."jadwal_dokter" ("dokter_id", "poli_id", "hari");

CREATE UNIQUE INDEX ON "rsud"."antrean" ("poli_id", "tanggal", "nomor_antrean");

CREATE INDEX ON "rsud"."antrean" ("user_nik");

CREATE INDEX ON "rsud"."antrean" ("tanggal");

CREATE INDEX ON "rsud"."antrean" ("status");

CREATE INDEX ON "darurat"."instansi" ("kategori");

CREATE INDEX ON "darurat"."instansi" ("kota");

CREATE INDEX ON "wisata"."destinasi" ("kota");

CREATE INDEX ON "wisata"."destinasi" ("kategori");

CREATE INDEX ON "wisata"."destinasi" ("lat", "lng");

CREATE INDEX ON "wisata"."foto_destinasi" ("destinasi_id");

CREATE INDEX ON "wisata"."tiket_pembelian" ("user_nik");

CREATE INDEX ON "wisata"."tiket_pembelian" ("destinasi_id");

CREATE INDEX ON "wisata"."tiket_pembelian" ("tanggal_kunjungan");

CREATE INDEX ON "wisata"."tiket_pembelian" ("status");

CREATE INDEX ON "bansos"."penerima" ("user_nik");

CREATE INDEX ON "bansos"."penerima" ("program_id");

CREATE UNIQUE INDEX ON "bansos"."penerima" ("program_id", "user_nik");

CREATE INDEX ON "etibi"."hasil_skrining" ("user_nik");

CREATE INDEX ON "etibi"."log_konfirmasi" ("pasien_id");

CREATE INDEX ON "etibi"."log_konfirmasi" ("tanggal");

CREATE UNIQUE INDEX ON "etibi"."log_konfirmasi" ("pasien_id", "tanggal");

CREATE UNIQUE INDEX ON "sinaker"."profil_pencari" ("user_nik");

CREATE INDEX ON "sinaker"."lowongan" ("perusahaan_id");

CREATE INDEX ON "sinaker"."lowongan" ("status");

CREATE INDEX ON "sinaker"."lowongan" ("deadline");

CREATE UNIQUE INDEX ON "sinaker"."lamaran" ("lowongan_id", "user_nik");

CREATE INDEX ON "sinaker"."lamaran" ("user_nik");

CREATE INDEX ON "sinaker"."lamaran" ("status");

CREATE INDEX ON "transjatim"."halte" ("koridor_id");

CREATE INDEX ON "transjatim"."halte" ("lat", "lng");

CREATE INDEX ON "transjatim"."armada" ("koridor_id");

CREATE INDEX ON "transjatim"."armada" ("status");

CREATE INDEX ON "transjatim"."tiket" ("user_nik");

CREATE INDEX ON "transjatim"."tiket" ("status");

CREATE INDEX ON "transjatim"."tiket" ("valid_sampai");

COMMENT ON TABLE "auth"."users" IS 'Tabel utama SSO. NIK = identitas tunggal lintas semua service.';

COMMENT ON COLUMN "auth"."users"."nik" IS '16 digit NIK KTP';

COMMENT ON COLUMN "auth"."users"."password_hash" IS 'bcrypt rounds=10';

COMMENT ON TABLE "auth"."refresh_tokens" IS 'Satu user bisa punya banyak refresh_token (multi-device).';

COMMENT ON COLUMN "auth"."refresh_tokens"."fcm_token" IS 'Device token Firebase Cloud Messaging';

COMMENT ON COLUMN "bapenda"."kendaraan"."nik_pemilik" IS 'FK logis ke auth.users.nik';

COMMENT ON COLUMN "bapenda"."tagihan_pajak"."periode" IS 'Tahun, contoh: 2025';

COMMENT ON COLUMN "bapenda"."tagihan_pajak"."status" IS 'belum_bayar | lunas | kedaluwarsa';

COMMENT ON TABLE "bapenda"."transaksi_pembayaran" IS 'Diisi webhook dari Payment Gateway saat status berubah.';

COMMENT ON COLUMN "bapenda"."transaksi_pembayaran"."kode_bayar" IS 'Nomor VA atau kode QRIS';

COMMENT ON COLUMN "bapenda"."transaksi_pembayaran"."metode" IS 'virtual_account | qris';

COMMENT ON COLUMN "bapenda"."transaksi_pembayaran"."status" IS 'menunggu | sukses | kedaluwarsa | gagal';

COMMENT ON COLUMN "bapenda"."transaksi_pembayaran"."pg_reference" IS 'Reference ID dari Payment Gateway';

COMMENT ON COLUMN "bapenda"."transaksi_pembayaran"."tbpkp_url" IS 'URL file E-TBPKP PDF setelah lunas';

COMMENT ON COLUMN "bapok"."komoditas"."kategori" IS 'beras | minyak | daging | sayuran | telur | gula';

COMMENT ON COLUMN "bapok"."komoditas"."satuan" IS 'kg | liter | butir';

COMMENT ON TABLE "bapok"."harga_harian" IS 'Satu record = satu harga komoditas di satu pasar pada satu hari.';

COMMENT ON COLUMN "bapok"."harga_harian"."input_oleh" IS 'NIK admin Disperindag';

COMMENT ON TABLE "bapok"."price_alert" IS 'Dicek oleh cron job periodik via Redis queue.';

COMMENT ON COLUMN "bapok"."price_alert"."user_nik" IS 'FK logis ke auth.users.nik';

COMMENT ON COLUMN "bapok"."price_alert"."tipe" IS 'naik_diatas | turun_dibawah';

COMMENT ON COLUMN "islamic"."fasilitas"."nama" IS 'Aula Utama, Masjid Al-Akbar, dll';

COMMENT ON COLUMN "islamic"."acara"."status" IS 'aktif | selesai | dibatalkan';

COMMENT ON COLUMN "islamic"."acara"."dibuat_oleh" IS 'NIK admin Islamic Center';

COMMENT ON TABLE "islamic"."booking_fasilitas" IS 'Pessimistic locking diterapkan saat validasi overlap tanggal.';

COMMENT ON COLUMN "islamic"."booking_fasilitas"."user_nik" IS 'FK logis ke auth.users.nik';

COMMENT ON COLUMN "islamic"."booking_fasilitas"."dokumen_url" IS 'Surat permohonan PDF';

COMMENT ON COLUMN "islamic"."booking_fasilitas"."status" IS 'pending_review | approved | rejected | lunas';

COMMENT ON COLUMN "islamic"."booking_fasilitas"."reviewed_by" IS 'NIK admin yang approve/reject';

COMMENT ON COLUMN "islamic"."pendaftaran_acara"."qr_payload" IS 'Base64 QR terenkripsi {id_booking, NIK}';

COMMENT ON COLUMN "islamic"."pendaftaran_acara"."status" IS 'valid | digunakan | dibatalkan';

COMMENT ON COLUMN "rsud"."jadwal_dokter"."hari" IS 'senin | selasa | rabu | kamis | jumat | sabtu';

COMMENT ON TABLE "rsud"."antrean" IS 'Nomor antrean di-generate sekuensial per poli per tanggal.';

COMMENT ON COLUMN "rsud"."antrean"."user_nik" IS 'FK logis ke auth.users.nik';

COMMENT ON COLUMN "rsud"."antrean"."nomor_antrean" IS 'Format: A-001, B-023';

COMMENT ON COLUMN "rsud"."antrean"."qr_checkin" IS 'Base64 QR untuk check-in loket';

COMMENT ON COLUMN "rsud"."antrean"."status" IS 'menunggu | dipanggil | selesai | batal';

COMMENT ON TABLE "darurat"."instansi" IS 'Data statis. Di-cache agresif. Disematkan di Core App saat install.';

COMMENT ON COLUMN "darurat"."instansi"."kategori" IS 'polisi | damkar | ambulans | sar | pusat';

COMMENT ON COLUMN "darurat"."instansi"."nomor" IS 'Nomor lengkap dengan kode area';

COMMENT ON COLUMN "darurat"."instansi"."nomor_cepat" IS '110, 112, 113, 119';

COMMENT ON COLUMN "darurat"."laporan_panic"."dikirim_ke" IS 'Nama instansi Command Center';

COMMENT ON COLUMN "darurat"."laporan_panic"."webhook_status" IS 'terkirim | gagal';

COMMENT ON COLUMN "wisata"."destinasi"."kategori" IS 'alam | budaya | buatan';

COMMENT ON COLUMN "wisata"."destinasi"."fasilitas" IS 'Array: parkir, toilet, mushola, dll';

COMMENT ON COLUMN "wisata"."foto_destinasi"."url" IS 'URL MinIO object storage';

COMMENT ON COLUMN "wisata"."foto_destinasi"."urutan" IS '0 = foto utama';

COMMENT ON COLUMN "wisata"."tiket_pembelian"."qr_payload" IS 'Terenkripsi: {id_transaksi, NIK}';

COMMENT ON COLUMN "wisata"."tiket_pembelian"."status" IS 'valid | digunakan | kedaluwarsa';

COMMENT ON COLUMN "bansos"."program"."nama" IS 'PKH, BPNT, BLT Provinsi, dll';

COMMENT ON COLUMN "bansos"."program"."periode" IS 'Tahun';

COMMENT ON COLUMN "bansos"."program"."status" IS 'aktif | selesai | ditangguhkan';

COMMENT ON TABLE "bansos"."penerima" IS 'Data diupdate via bulk CSV sync oleh Admin Dinsos.';

COMMENT ON COLUMN "bansos"."penerima"."user_nik" IS 'FK logis ke auth.users.nik';

COMMENT ON COLUMN "bansos"."penerima"."status_pencairan" IS 'diproses | proses_bank | selesai | ditangguhkan';

COMMENT ON COLUMN "bansos"."penerima"."sp2d_at" IS 'Tanggal SP2D diterbitkan';

COMMENT ON COLUMN "bansos"."penerima"."bank_at" IS 'Tanggal masuk proses bank';

COMMENT ON COLUMN "bansos"."penerima"."cair_at" IS 'Tanggal selesai cair';

COMMENT ON COLUMN "etibi"."pertanyaan_skrining"."teks" IS 'Teks pertanyaan gejala TBC';

COMMENT ON COLUMN "etibi"."pertanyaan_skrining"."bobot" IS 'Bobot untuk kalkulasi skor risiko';

COMMENT ON COLUMN "etibi"."hasil_skrining"."kategori_risiko" IS 'rendah | sedang | tinggi';

COMMENT ON COLUMN "etibi"."pasien_aktif"."fase_pengobatan" IS 'intensif | lanjutan';

COMMENT ON COLUMN "etibi"."pasien_aktif"."jam_minum_obat" IS 'Jam reminder harian';

COMMENT ON COLUMN "etibi"."pasien_aktif"."faskes_id" IS 'ID puskesmas/faskes penanganan';

COMMENT ON COLUMN "etibi"."pasien_aktif"."status" IS 'aktif | selesai | mangkir | dropout';

COMMENT ON TABLE "etibi"."log_konfirmasi" IS 'Satu record per pasien per hari. Cron job cek jika 3 hari berturut kosong → status mangkir.';

COMMENT ON COLUMN "sinaker"."profil_pencari"."skill" IS 'Array string skill: Flutter, NestJS, dll';

COMMENT ON COLUMN "sinaker"."profil_pencari"."pendidikan" IS '[{jenjang, jurusan, institusi, tahun_lulus}]';

COMMENT ON COLUMN "sinaker"."profil_pencari"."pengalaman" IS '[{posisi, perusahaan, tahun_mulai, tahun_selesai}]';

COMMENT ON COLUMN "sinaker"."perusahaan"."verified" IS 'Diverifikasi Disnaker';

COMMENT ON COLUMN "sinaker"."perusahaan"."admin_nik" IS 'NIK admin HRD perusahaan';

COMMENT ON COLUMN "sinaker"."lowongan"."kualifikasi" IS 'Array tag skill yang dibutuhkan';

COMMENT ON COLUMN "sinaker"."lowongan"."tipe_kerja" IS 'fulltime | parttime | freelance | magang';

COMMENT ON COLUMN "sinaker"."lowongan"."status" IS 'aktif | ditutup | draft';

COMMENT ON TABLE "sinaker"."lamaran" IS 'Kanban HRD drag-and-drop mengupdate kolom status.';

COMMENT ON COLUMN "sinaker"."lamaran"."matching_score" IS '0-100, kalkulasi saat apply';

COMMENT ON COLUMN "sinaker"."lamaran"."status" IS 'terkirim | sedang_direview | dipanggil_interview | diterima | ditolak';

COMMENT ON COLUMN "transjatim"."koridor"."kode" IS 'Koridor 1, Koridor 2, dll';

COMMENT ON TABLE "transjatim"."armada" IS 'Koordinat di-update tiap detik dari IoT bus. Broadcast via WebSocket/MQTT ke klien.';

COMMENT ON COLUMN "transjatim"."armada"."lat" IS 'Diupdate real-time via IoT GPS';

COMMENT ON COLUMN "transjatim"."armada"."status" IS 'aktif | istirahat | nonaktif';

COMMENT ON TABLE "transjatim"."tiket" IS 'QR berstandar TOTP — time-based expiry mencegah reuse screenshot.';

COMMENT ON COLUMN "transjatim"."tiket"."qr_totp" IS 'TOTP/HOTP — expired jika di-screenshot besok';

COMMENT ON COLUMN "transjatim"."tiket"."status" IS 'valid | terpakai | kedaluwarsa';

ALTER TABLE "auth"."refresh_tokens" ADD FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bapenda"."tagihan_pajak" ADD FOREIGN KEY ("kendaraan_id") REFERENCES "bapenda"."kendaraan" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bapenda"."transaksi_pembayaran" ADD FOREIGN KEY ("tagihan_id") REFERENCES "bapenda"."tagihan_pajak" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bapok"."harga_harian" ADD FOREIGN KEY ("komoditas_id") REFERENCES "bapok"."komoditas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bapok"."harga_harian" ADD FOREIGN KEY ("pasar_id") REFERENCES "bapok"."pasar" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bapok"."price_alert" ADD FOREIGN KEY ("komoditas_id") REFERENCES "bapok"."komoditas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "islamic"."booking_fasilitas" ADD FOREIGN KEY ("fasilitas_id") REFERENCES "islamic"."fasilitas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "islamic"."pendaftaran_acara" ADD FOREIGN KEY ("acara_id") REFERENCES "islamic"."acara" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "rsud"."jadwal_dokter" ADD FOREIGN KEY ("dokter_id") REFERENCES "rsud"."dokter" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "rsud"."jadwal_dokter" ADD FOREIGN KEY ("poli_id") REFERENCES "rsud"."poli" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "rsud"."antrean" ADD FOREIGN KEY ("poli_id") REFERENCES "rsud"."poli" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "rsud"."antrean" ADD FOREIGN KEY ("dokter_id") REFERENCES "rsud"."dokter" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "wisata"."foto_destinasi" ADD FOREIGN KEY ("destinasi_id") REFERENCES "wisata"."destinasi" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "wisata"."tiket_pembelian" ADD FOREIGN KEY ("destinasi_id") REFERENCES "wisata"."destinasi" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bansos"."penerima" ADD FOREIGN KEY ("program_id") REFERENCES "bansos"."program" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bansos"."pengumuman" ADD FOREIGN KEY ("program_id") REFERENCES "bansos"."program" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "etibi"."log_konfirmasi" ADD FOREIGN KEY ("pasien_id") REFERENCES "etibi"."pasien_aktif" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "sinaker"."lowongan" ADD FOREIGN KEY ("perusahaan_id") REFERENCES "sinaker"."perusahaan" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "sinaker"."lamaran" ADD FOREIGN KEY ("lowongan_id") REFERENCES "sinaker"."lowongan" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "transjatim"."halte" ADD FOREIGN KEY ("koridor_id") REFERENCES "transjatim"."koridor" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "transjatim"."armada" ADD FOREIGN KEY ("koridor_id") REFERENCES "transjatim"."koridor" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "transjatim"."tiket" ADD FOREIGN KEY ("koridor_id") REFERENCES "transjatim"."koridor" ("id") DEFERRABLE INITIALLY IMMEDIATE;

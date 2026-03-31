# Majadigi Super App - Core Monorepo

Repositori ini merupakan pusat pengembangan ekosistem layanan publik Majadigi. Proyek ini menggunakan arsitektur Microservices yang dikelola dalam satu repositori (Monorepo) untuk optimalisasi alur kerja pengembangan dan integrasi sistem.

---

## Struktur Direktori

```text
majadigi-superapp/
├── .husky/             # Git Hooks untuk validasi pesan commit
├── mobile/             # Flutter Mobile App
├── gateway/            # API Gateway dan Aggregator (NestJS)
├── services/
│   ├── core/           # Layanan inti 
│   └── dummy/          # 10 Layanan OPD berbasis NestJS
├── infra/              # Konfigurasi Docker, Redis, dan PostgreSQL
└── package.json        # Dependensi root dan konfigurasi scripts
```

## Spesifikasi Teknologi

- **Frontend:** Flutter (Dart)
- **Backend:** NestJS (TypeScript)
- **Database:** PostgreSQL (Konfigurasi Multi-schema)
- **Caching:** Redis (Penerapan Cache-Aside Pattern)
- **DevOps:** Docker, Husky, Commitlint

## Panduan Instalasi Lokal

### 1. Kloning Repositori
Gunakan perintah berikut untuk mengunduh proyek ke direktori lokal Anda:
```bash
git clone [https://github.com/Capstone-Majadigi-4/majadigi-superapp.git](https://github.com/Capstone-Majadigi-4/majadigi-superapp.git)
cd majadigi-superapp
```

### 2. Konfigurasi Lingkungan Pengembangan (Development Tools)
Instalasi Husky dan library pendukung untuk memastikan standar kode terjaga:
```bash
npm install
```

### 3. Menjalankan Layanan (Docker)
Pastikan Docker Engine telah berjalan di perangkat Anda, kemudian eksekusi perintah berikut:
```bash
docker-compose up -d
```

---

## Protokol Kontribusi

### 1. Strategi Pencabangan (Git Branching)
Setiap pengembang wajib mengikuti struktur branch berikut:
- **main**: Branch production (hanya untuk rilis stabil dan presentasi).
- **dev**: Branch integrasi utama (penggabungan seluruh fitur baru) -> nanti kerjainnya semua buat ambil branchnya dari sini ya baru PR ke main.
- **feature/[nama-fitur]**: Digunakan untuk pengembangan fitur baru.
- **fix/[nama-bug]**: Digunakan untuk perbaikan kesalahan (bug).

### 2. Standar Pesan Commit (Conventional Commits)
Sistem menggunakan Husky dan Commitlint untuk memvalidasi setiap pesan commit. Format yang diwajibkan adalah: `<type>: <description>`

Tipe yang diizinkan:
- **feat**: Penambahan fitur baru.
- **fix**: Perbaikan bug.
- **docs**: Pembaruan dokumentasi.
- **chore**: Pembaruan konfigurasi, dependensi, atau build tools.
- **refactor**: Perbaikan struktur kode tanpa mengubah fungsionalitas.

*Contoh: `feat: implement redis caching for bapenda service`*

### 3. Alur Pull Request (PR)
- Pengembangan fitur dilakukan pada branch masing-masing.
- Pengajuan penggabungan kode dilakukan melalui Pull Request ke branch **dev**.
- PR wajib mendapatkan persetujuan (Approval) dari minimal satu anggota tim sebelum digabungkan.

---

## Daftar Layanan Terintegrasi

| Layanan | Teknologi |
| :--- | :--- |
| **Nomer Darurat** | NestJS |
| **Bapenda** | NestJS |
| **Sinaker** | NestJS |
| **Skrining E-TIBI** | NestJS |
| **Wisata Jatim** | NestJS |
| **Info Bansos** | NestJS |
| **Transjatim** | NestJS |
| **Harga Bahan Pokok** | NestJS |
| **Islamic Center** | NestJS |
| **RSUD Saiful Anwar** | NestJS |

---

**Kelompok 4 Capstone Project - C.1**
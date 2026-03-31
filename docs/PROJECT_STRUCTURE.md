# 📦 Majadigi Super App - Project Structure & Workflow

Dokumen ini menjelaskan struktur repository, fungsi setiap folder, serta aturan kerja tim dalam pengembangan proyek Majadigi Super App.

---

# 1. Struktur Repository
```
majadigi-superapp/

services/
    gateway-service/
    auth-service/
    transport-service/
    health-service/
    economy-service/

mobile/
    majadigi-app/
        lib/
        pubspec.yaml

infrastructure/
    docker-compose.yml
    nginx/
        nginx.conf

docs/

.env.example
.gitignore
README.md
```


---

# 2. Penjelasan Folder

## 🔹 services/

Folder ini berisi seluruh backend microservices.

Contoh:
```
services/
gateway-service/
auth-service/
transport-service/
health-service/
economy-service/
```


### Fungsi:
- Menyimpan kode backend (NestJS)
- Setiap service berdiri sendiri (independent)
- Setiap service memiliki:
  - `Dockerfile`
  - `package.json`
  - source code (`src/`)

### Catatan:
- 1 service = 1 container
- Tidak boleh saling akses database langsung
- Komunikasi antar service melalui API

---

## 🔹 mobile/

Folder ini berisi aplikasi Flutter.

Contoh:
```
mobile/
majadigi-app/
lib/
pubspec.yaml
```


### Fungsi:
- Menyimpan seluruh kode frontend mobile
- Mengakses backend melalui API Gateway

### Catatan:
- Tidak boleh mengakses service secara langsung
- Semua request harus melalui gateway

---

## 🔹 infrastructure/

Folder ini dikelola oleh DevOps.

Contoh:
```
infrastructure/
docker-compose.yml
nginx/
nginx.conf
```


### Fungsi:
- Mengatur integrasi seluruh service
- Menjalankan container menggunakan Docker
- Mengatur routing melalui Nginx

### Isi utama:
- `docker-compose.yml` → menjalankan semua service
- `nginx.conf` → reverse proxy

---

## 🔹 docs/

Dokumentasi proyek.

### Fungsi:
- Menyimpan dokumentasi teknis
- Menyimpan arsitektur sistem
- Menyimpan panduan penggunaan

---

## 🔹 Root Files

### `.env.example`
Template environment variable.

Contoh:
```
DB_HOST=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
```


### `.gitignore`
File yang tidak boleh di-commit.

### `README.md`
Panduan singkat menjalankan project.

---
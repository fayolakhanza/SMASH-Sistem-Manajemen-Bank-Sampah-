# SMASH — Backend Bank Sampah Digital & Daur Ulang (Eco-Waste Management System)
**Ujian Kompetensi Keahlian (UKK) Rekayasa Perangkat Lunak 2026/2027 — Paket A**

Backend RESTful API multi-tenant lengkap yang dibangun dengan framework **NestJS**, **Prisma ORM**, dan basis data **MySQL**, sesuai dengan Kontrak API dan standar spesifikasi SMK Telkom Malang.

---

## 🌟 Fitur Utama
1. **Multi-Tenant Architecture (`x-app-key`)**: Seluruh transaksi dan entitas data terisolasi 100% aman antar siswa (App Maker).
2. **Autentikasi JWT Multi-Role**: Mendukung peran `NASABAH` dan `ADMIN` dengan otorisasi berbasis Role Guard.
3. **Penyetoran Sampah (Multi-Item & Foto Bukti)**: Nasabah dapat mengajukan setoran multi-kategori sampah beserta foto bukti fisik, dan Admin dapat melakukan konfirmasi penimbangan aktual.
4. **Katalog Hadiah & Voucher Digital**: Penukaran poin secara real-time dengan proteksi saldo/stok menggunakan **Prisma Interactive Transactions** (`prisma.$transaction`) serta penerbitan otomatis kode voucher digital.
5. **Rekapitulasi & Pelaporan Bulanan**: Kalkulasi total tonase sampah (kg & ton), estimasi perputaran rupiah, poin terdistribusi, serta rincian breakdown per kategori sampah (`plastik`, `kertas`, `logam`, `kaca`).
6. **Dashboard & Analytics**: Ringkasan performa nasabah & statistik admin.
7. **Format Response Baku JSON**:
   - **Sukses**: `{ "statusCode": 200/201, "success": true, "message": "...", "data": ... }`
   - **Error**: `{ "statusCode": 4xx/5xx, "success": false, "message": "...", "errors": null/[...], "timestamp": "ISO 8601" }`

---

## 🛠️ Persyaratan Sistem & Tech Stack
- **Node.js**: v18+ (direkomendasikan v20+)
- **Database**: MySQL Server (XAMPP / Laragon / Standalone MySQL)
- **Framework**: NestJS v11
- **ORM**: Prisma v6
- **Testing Client**: Postman

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Masuk ke Direktori Backend
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Konfigurasi File Environment (.env)
Buka file `.env` dan sesuaikan koneksi database MySQL Anda:
```env
DATABASE_URL="mysql://root:@localhost:3306/bank_sampah_db"
PORT=3000
JWT_SECRET="super-secret-jwt-key-for-bank-sampah-ukk-2026"
JWT_EXPIRES_IN="7d"
APP_URL="http://localhost:3000"
```
> **Catatan**: Pastikan MySQL Server Anda sedang berjalan dan database `bank_sampah_db` sudah dibuat jika menggunakan `db push` / migration.

### 4. Push Skema ke Basis Data (Prisma)
Jalankan perintah berikut untuk membuat seluruh tabel dan relasi secara otomatis di MySQL:
```bash
npx prisma db push
```

### 5. Jalankan Backend Server
- **Mode Development (Watch mode)**:
  ```bash
  npm run start:dev
  ```
- **Mode Production Build**:
  ```bash
  npm run build
  npm run start:prod
  ```

Server akan aktif di: `http://localhost:3000`

---

## 🧪 Panduan Pengujian Menggunakan Postman

Telah disediakan file koleksi Postman yang mencakup seluruh endpoint di direktori `backend/postman/Bank_Sampah_API_UKK_2026.postman_collection.json`.

### Langkah-langkah Pengujian Cepat:
1. Buka aplikasi **Postman**.
2. Klik tombol **Import** lalu pilih file:
   `backend/postman/Bank_Sampah_API_UKK_2026.postman_collection.json`
3. **Langkah 1**: Jalankan request `1. App Maker -> 1. Register App Maker`. Postman akan otomatis menyimpan `app_key` ke dalam Collection Variables.
4. **Langkah 2**: Jalankan `2. Autentikasi Pengguna -> 6. Pendaftaran Unit Admin Bank Sampah` dan `5. Registrasi Nasabah Baru`.
5. **Langkah 3**: Jalankan `2. Autentikasi Pengguna -> 7.1 Login Admin` dan `7.2 Login Nasabah`. Token JWT akan otomatis tersimpan di variable `{{admin_token}}` dan `{{nasabah_token}}`.
6. Seluruh request lainnya pada folder **CRUD Nasabah**, **Kategori Sampah**, **Penyetoran**, **Katalog Hadiah**, **Penukaran Poin**, **Rekapitulasi Bulanan**, dan **Dashboard** siap dijalankan!

---

## 📋 Ringkasan Endpoint API

| No | Method | Endpoint | Role / Auth | Deskripsi |
|---|---|---|---|---|
| 1 | POST | `/api/v1/maker/register` | Public | Registrasi Akun Siswa (Generate App Key) |
| 2 | POST | `/api/v1/maker/login` | Public | Login Akun Siswa Frontend |
| 3 | GET | `/api/v1/maker/profile` | `x-app-key` | Profil Siswa & Statistik Tenant |
| 4 | GET | `/api/v1/maker/check-key` | Public | Lookup App Key berdasarkan Email Siswa |
| 5 | POST | `/api/v1/auth/nasabah/register` | `x-app-key` | Registrasi Nasabah Baru (+ Upload Foto) |
| 6 | POST | `/api/v1/auth/admin/register` | `x-app-key` | Pendaftaran Unit Admin Bank Sampah |
| 7 | POST | `/api/v1/auth/login` | `x-app-key` | Login Bersama User (Nasabah/Admin) |
| 8 | GET | `/api/v1/auth/me` | Bearer Token | Cek Profil & Role User yang Login |
| 9 | GET | `/api/v1/admin/nasabah` | Admin | Get Seluruh Data Nasabah Bank Sampah |
| 10 | POST | `/api/v1/admin/nasabah` | Admin | Tambah Data Nasabah Baru (+ Upload Foto) |
| 11 | GET | `/api/v1/admin/nasabah/:id` | Admin | Get Detail Data Nasabah |
| 12 | PUT | `/api/v1/admin/nasabah/:id` | Admin | Update Data Nasabah (+ Upload Foto) |
| 13 | DELETE | `/api/v1/admin/nasabah/:id` | Admin | Hapus Data Nasabah |
| 14 | GET | `/api/v1/kategori-sampah` | `x-app-key` | Daftar Kategori Sampah, Harga/Kg & Poin/Kg |
| 15 | POST | `/api/v1/kategori-sampah` | Admin | Tambah Kategori Sampah Baru (+ Upload Foto) |
| 16 | GET | `/api/v1/kategori-sampah/:id` | `x-app-key` | Get Detail Kategori Sampah |
| 17 | PUT | `/api/v1/kategori-sampah/:id` | Admin | Update Kategori Sampah (+ Upload Foto) |
| 18 | DELETE | `/api/v1/kategori-sampah/:id` | Admin | Hapus Kategori Sampah |
| 19 | POST | `/api/v1/setor-sampah/pengajuan` | Nasabah | Pengajuan Setor Sampah (Multi-Item & Foto) |
| 20 | GET | `/api/v1/setor-sampah/my-setor` | Nasabah | Histori Penyetoran Sampah Sendiri (?bulan) |
| 21 | GET | `/api/v1/setor-sampah/admin/list` | Admin | Seluruh Pengajuan Penyetoran (?status & ?bulan) |
| 22 | GET | `/api/v1/setor-sampah/:id` | Nasabah/Admin | Detail Transaksi / Struk Nota Setor |
| 23 | PUT | `/api/v1/setor-sampah/admin/verify/:id` | Admin | Verifikasi Penimbangan Real & Update Poin |
| 24 | GET | `/api/v1/hadiah` | `x-app-key` | Katalog Barang / Voucher Hadiah |
| 25 | POST | `/api/v1/hadiah` | Admin | Tambah Data Hadiah Baru (+ Upload Foto) |
| 26 | GET | `/api/v1/hadiah/:id` | `x-app-key` | Get Detail Barang / Hadiah |
| 27 | PUT | `/api/v1/hadiah/:id` | Admin | Update Data Hadiah (+ Upload Foto) |
| 28 | DELETE | `/api/v1/hadiah/:id` | Admin | Hapus Data Hadiah |
| 29 | POST | `/api/v1/penukaran-poin/tukar` | Nasabah | Tukar Poin dengan Hadiah / Voucher Online |
| 30 | GET | `/api/v1/penukaran-poin/my-penukaran` | Nasabah | Histori Penukaran Poin Sendiri |
| 31 | GET | `/api/v1/penukaran-poin/admin/list` | Admin | Semua Transaksi Penukaran Poin (?bulan) |
| 32 | PUT | `/api/v1/penukaran-poin/admin/status/:id` | Admin | Update Status Penukaran (diproses / selesai) |
| 33 | GET | `/api/v1/penukaran-poin/nota/:id` | Nasabah/Admin | Detail Struk / Nota Bukti Penukaran Poin |
| 34 | GET | `/api/v1/rekapitulasi/bulanan` | Admin | Rekap Total Tonase, Rupiah & Poin (?bulan) |
| 35 | GET | `/api/v1/dashboard/summary` | Nasabah | Summary Saldo & Histori Terakhir Nasabah |
| 36 | GET | `/api/v1/dashboard/stats` | `x-app-key` | Statistik Umum Admin & App Maker |

# Quick Start Guide - DoneRight Full Stack

Panduan cepat untuk menjalankan aplikasi DoneRight (Frontend + Backend).

## Prerequisites

✅ Node.js 18+
✅ pnpm (install: `npm install -g pnpm`)
✅ Akun Supabase

## Setup Database (10 menit)

### 1. Buat Supabase Project

1. Buka https://supabase.com
2. Klik "New Project"
3. Isi nama project dan password database
4. Tunggu project selesai dibuat (~2 menit)

### 2. Jalankan Database Schema

1. Di Supabase dashboard, klik "SQL Editor"
2. Buka file `backend/schema.sql` di repo ini
3. Copy semua isi file
4. Paste di SQL Editor dan klik "Run"
5. Pastikan muncul pesan sukses

### 3. Copy Database URL

1. Di Supabase dashboard, buka Settings > Database
2. Scroll ke "Connection string"
3. Copy connection string yang ada
4. Simpan untuk step selanjutnya

## Setup Backend (5 menit)

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install dependencies
pnpm install

# 3. Buat file .env
cp .env.example .env

# 4. Edit .env dan isi dengan:
#    - DATABASE_URL dari Supabase (step 3 di atas)
#    - JWT_SECRET dengan string random (misal: mySecretKey123)
nano .env  # atau gunakan text editor favorit

# 5. Jalankan server
pnpm dev
```

✅ Jika berhasil, akan muncul:
```
✅ Connected to PostgreSQL database
🚀 Server running on http://localhost:5000
```

## Setup Frontend (3 menit)

Buka terminal baru (jangan tutup terminal backend):

```bash
# 1. Kembali ke root folder (jika masih di backend/)
cd ..

# 2. Install dependencies
pnpm install

# 3. Buat file .env
cp .env.example .env

# 4. Edit .env (opsional, sudah ada default value)
# VITE_API_URL=http://localhost:5000/api

# 5. Jalankan frontend
pnpm dev
```

✅ Aplikasi akan terbuka di browser: `http://localhost:3000`

## Test Aplikasi

### 1. Test Login Admin

1. Buka `http://localhost:3000`
2. Klik "Login"
3. Gunakan credentials:
   - Email: `admin@doneright.com`
   - Password: `admin123`
4. Anda akan masuk ke Admin Dashboard

### 2. Test Register & Login Mahasiswa

1. Logout dari admin
2. Klik "Belum punya akun? Daftar di sini"
3. Isi form registrasi
4. Login dengan akun yang baru dibuat
5. Anda akan masuk ke Student Dashboard

### 3. Test CRUD Tugas

1. Klik "Tambah Tugas"
2. Isi form tugas
3. Klik "Simpan"
4. Refresh halaman - data tetap ada (persisten!)
5. Coba edit, hapus, complete tugas

## Troubleshooting

### ❌ Backend error: "Database connection failed"

**Solusi:**
- Cek `DATABASE_URL` di `backend/.env` sudah benar
- Pastikan Supabase project sudah aktif
- Cek koneksi internet

### ❌ Frontend error: "Failed to fetch"

**Solusi:**
- Pastikan backend sudah running di `http://localhost:5000`
- Cek `VITE_API_URL` di `.env` root folder
- Restart frontend (`Ctrl+C` lalu `pnpm dev` lagi)

### ❌ Login gagal: "Email atau password salah"

**Solusi untuk admin:**
- Pastikan schema.sql sudah dijalankan di Supabase
- Admin default: `admin@doneright.com` / `admin123`

**Solusi untuk mahasiswa:**
- Pastikan sudah register terlebih dahulu
- Cek email dan password yang digunakan saat register

### ❌ pnpm command not found

**Solusi:**
```bash
npm install -g pnpm
```

## Selesai! 🎉

Sekarang Anda memiliki:
- ✅ Frontend running di `http://localhost:3000`
- ✅ Backend API running di `http://localhost:5000`
- ✅ Database PostgreSQL di Supabase
- ✅ Data persisten (tidak hilang saat refresh)

## Next Steps

- Explore fitur-fitur dashboard
- Coba generate laporan CSV
- Test filter, search, dan sorting
- Lihat dokumentasi lengkap di `README.md`
- Baca API documentation di `backend/README.md`

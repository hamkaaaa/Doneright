# Deployment Guide - DoneRight Full Stack

Guide lengkap untuk deploy aplikasi DoneRight (Frontend + Backend).

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │  API    │    Backend      │  SQL    │   Supabase      │
│   (Vercel)      │◄────────┤  (Render/Fly.io)│◄────────┤  (PostgreSQL)   │
│   React + Vite  │         │  Express + JWT  │         │   Database      │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## Part 1: Setup Database (Supabase)

### 1.1 Create Supabase Project

1. Daftar/login ke https://supabase.com
2. Klik "New Project"
3. Isi:
   - **Name**: doneright-db
   - **Database Password**: [buat password yang kuat]
   - **Region**: Southeast Asia (Singapore) - pilih yang terdekat
4. Tunggu ~2 menit sampai project ready

### 1.2 Run Database Schema

1. Buka Supabase Dashboard > SQL Editor
2. Klik "New Query"
3. Copy seluruh isi file `backend/schema.sql`
4. Paste ke SQL Editor
5. Klik "Run" atau tekan Ctrl+Enter
6. ✅ Sukses jika muncul "Success. No rows returned"

### 1.3 Get Connection String

1. Buka Settings > Database
2. Scroll ke section "Connection string"
3. Pilih tab "URI"
4. Copy connection string yang mirip:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Replace `[PASSWORD]` dengan password database yang Anda buat di step 1.1
6. **Simpan** connection string ini untuk Part 2

---

## Part 2: Deploy Backend

Backend bisa di-deploy ke salah satu platform berikut. Pilih yang paling familiar:

### Option A: Render (Recommended - Free tier available)

#### 2.A.1 Setup

1. Daftar/login ke https://render.com
2. Klik "New +" > "Web Service"
3. Connect GitHub repository ini
4. Isi konfigurasi:
   - **Name**: `doneright-backend`
   - **Region**: Singapore (atau terdekat)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `pnpm install`
   - **Start Command**: `pnpm start`

#### 2.A.2 Environment Variables

Tambahkan environment variables:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=ganti_dengan_string_random_yang_paling_kuat_seperti_ini_ABC123xyz789!@#
PORT=5000
NODE_ENV=production
```

**PENTING**: Ganti `JWT_SECRET` dengan random string yang kuat!

#### 2.A.3 Deploy

1. Klik "Create Web Service"
2. Tunggu ~3-5 menit untuk build & deploy
3. ✅ Backend URL akan tersedia: `https://doneright-backend.onrender.com`
4. **Simpan URL ini** untuk Part 3

#### 2.A.4 Test Backend

Buka browser dan akses:
```
https://doneright-backend.onrender.com/
```

Harusnya muncul response JSON:
```json
{"message": "DoneRight API Server is running!"}
```

### Option B: Railway (Alternative)

1. Daftar di https://railway.app
2. Klik "New Project" > "Deploy from GitHub repo"
3. Pilih repo ini
4. Klik "Add variables" dan isi environment variables sama seperti Option A
5. Update start command: `cd backend && pnpm start`

### Option C: Fly.io (Alternative)

1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Login: `fly auth login`
3. Di folder `backend/`, run:
   ```bash
   fly launch
   fly secrets set DATABASE_URL="..." JWT_SECRET="..."
   fly deploy
   ```

---

## Part 3: Deploy Frontend (Vercel)

### 3.1 Setup Environment Variable

1. Buat file `.env` di **root folder** (bukan backend):
   ```env
   VITE_API_URL=https://doneright-backend.onrender.com/api
   ```
   
   **Ganti URL** dengan backend URL dari Part 2!

### 3.2 Deploy ke Vercel

#### Via Vercel Dashboard (Recommended)

1. Push code ke GitHub:
   ```bash
   git add .
   git commit -m "Setup deployment"
   git push
   ```

2. Login ke https://vercel.com
3. Klik "Add New..." > "Project"
4. Import repository GitHub
5. Konfigurasi:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `pnpm build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

6. Tambah Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://doneright-backend.onrender.com/api` (backend URL dari Part 2)

7. Klik "Deploy"
8. Tunggu ~2 menit
9. ✅ Frontend URL: `https://doneright-xxx.vercel.app`

#### Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL

# Deploy to production
vercel --prod
```

---

## Part 4: Test Full Stack

### 4.1 Test Admin Account

1. Buka frontend URL di browser
2. Klik "Login"
3. Gunakan:
   - Email: `admin@doneright.com`
   - Password: `admin123`
4. ✅ Masuk ke Admin Dashboard dengan data real dari database

### 4.2 Test Register & CRUD

1. Logout dari admin
2. Klik "Daftar"
3. Register akun mahasiswa baru
4. Login dengan akun baru
5. Test:
   - Tambah tugas baru
   - Edit tugas
   - Tandai selesai
   - Hapus tugas
6. Refresh browser - data tetap ada! ✅

### 4.3 Test dari Device Lain

1. Buka frontend URL dari HP atau komputer lain
2. Login dengan akun yang sama
3. Data sama dan sinkron ✅

---

## Troubleshooting

### ❌ Frontend: "Failed to fetch"

**Kemungkinan Penyebab:**
1. Backend belum deploy atau down
2. VITE_API_URL salah
3. CORS issue

**Solusi:**
1. Test backend URL di browser: `https://your-backend.onrender.com/`
2. Cek environment variable `VITE_API_URL` di Vercel dashboard
3. Pastikan backend `cors()` middleware sudah di-enable (sudah ada di code)

### ❌ Backend: "Database connection failed"

**Solusi:**
1. Cek `DATABASE_URL` di environment variables backend
2. Pastikan Supabase project masih aktif
3. Cek password di connection string sudah benar

### ❌ Login failed: "Token tidak valid"

**Solusi:**
1. Clear browser localStorage: F12 > Application > Local Storage > Clear All
2. Pastikan `JWT_SECRET` di backend environment sama (jangan berubah)

### ❌ Vercel build timeout

**Solusi:**
- Pastikan `.vercelignore` ada dan contain `backend/`
- Pastikan `pnpm-workspace.yaml` hanya contain `'.'` (tidak include backend)

---

## URLs Checklist

Setelah deployment selesai, simpan URLs ini:

- ✅ **Database**: Supabase Dashboard
- ✅ **Backend API**: `https://doneright-backend.onrender.com`
- ✅ **Frontend**: `https://doneright-xxx.vercel.app`

---

## Update Code (After Changes)

### Update Frontend

```bash
git add .
git commit -m "Update frontend"
git push
```

Vercel akan auto-deploy (2-3 menit).

### Update Backend

```bash
git add .
git commit -m "Update backend"
git push
```

Render akan auto-deploy (3-5 menit).

---

## Cost

- **Supabase**: Free tier (500 MB database, 2 GB bandwidth)
- **Render**: Free tier (512 MB RAM, akan sleep setelah 15 menit tidak aktif)
- **Vercel**: Free tier (100 GB bandwidth, unlimited deployments)

**Total: Rp 0 / bulan** untuk development/portfolio!

---

## Security Notes

🔒 **PENTING - Sebelum Production:**

1. **Ganti Admin Password**:
   - Login sebagai admin
   - Ganti password dari `admin123`

2. **Generate JWT_SECRET yang kuat**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Limit CORS** di backend:
   ```typescript
   app.use(cors({
     origin: 'https://your-frontend.vercel.app'
   }));
   ```

4. **Enable Supabase RLS** (Row Level Security) untuk extra protection

---

## Monitoring

- **Backend Logs**: Render Dashboard > Logs
- **Frontend Analytics**: Vercel Dashboard > Analytics
- **Database Stats**: Supabase Dashboard > Database > Usage

---

## Support

Jika ada masalah saat deployment:

1. Cek logs di platform masing-masing
2. Test API endpoint langsung di browser
3. Pastikan semua environment variables sudah benar
4. Restart services (Redeploy)

Good luck! 🚀

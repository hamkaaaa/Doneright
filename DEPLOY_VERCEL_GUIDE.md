# Panduan Deploy DoneRight ke Vercel

## Overview

DoneRight terdiri dari 2 bagian:
1. **Frontend (React)** → Deploy ke Vercel
2. **Backend (Express API)** → Deploy ke Render/Railway (free tier)

## Part 1: Deploy Backend ke Render (Free)

### 1.1 Persiapan Backend

Backend sudah siap di folder `backend/` dengan:
- ✅ JavaScript (bukan TypeScript)
- ✅ Express.js server
- ✅ PostgreSQL + Supabase
- ✅ package.json dengan dependencies

### 1.2 Push Code ke GitHub

```bash
# Di root project
git init
git add .
git commit -m "Initial commit - DoneRight app"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

### 1.3 Deploy Backend ke Render

1. **Buka Render.com**
   - Daftar/login di https://render.com
   - Klik "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Pilih repository DoneRight
   - Klik "Connect"

3. **Konfigurasi Service**
   - **Name**: `doneright-backend`
   - **Region**: Singapore (atau terdekat)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `pnpm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

4. **Environment Variables**
   
   Klik "Advanced" → "Add Environment Variable":
   
   ```
   PORT=5000
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres:Done_Right-05@db.mmdrzvvnmoplbdfaiixx.supabase.co:5432/postgres
   JWT_SECRET=doneright_secret_production_change_this
   ```

5. **Deploy**
   - Klik "Create Web Service"
   - Tunggu 3-5 menit
   - Backend URL akan tersedia: `https://doneright-backend.onrender.com`

6. **Test Backend**
   
   Buka di browser:
   ```
   https://doneright-backend.onrender.com
   ```
   
   Harusnya muncul:
   ```json
   {"message":"DoneRight API Server is running!"}
   ```

---

## Part 2: Deploy Frontend ke Vercel

### 2.1 Update Environment Variable

Edit file `.env` di root folder:

```env
VITE_API_URL=https://doneright-backend.onrender.com/api
```

**PENTING**: Ganti URL dengan backend URL Anda dari Render!

### 2.2 Push Update ke GitHub

```bash
git add .env
git commit -m "Update API URL for production"
git push
```

### 2.3 Deploy ke Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Login ke Vercel**
   - Buka https://vercel.com
   - Login dengan GitHub

2. **Import Project**
   - Klik "Add New..." → "Project"
   - Pilih repository GitHub (DoneRight)
   - Klik "Import"

3. **Configure Project**
   
   Vercel akan auto-detect settings. Pastikan:
   
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

4. **Environment Variables**
   
   Klik "Environment Variables" → Add:
   
   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://doneright-backend.onrender.com/api` |
   
   ⚠️ Ganti dengan backend URL Anda!

5. **Deploy**
   - Klik "Deploy"
   - Tunggu 2-3 menit
   - Frontend URL: `https://doneright-xxx.vercel.app`

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL production
# Paste: https://doneright-backend.onrender.com/api

# Deploy to production
vercel --prod
```

---

## Part 3: Testing Full Stack

### 3.1 Test Backend

```bash
# Health check
curl https://doneright-backend.onrender.com/

# Test login (will fail if no user, but should return JSON error)
curl -X POST https://doneright-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

### 3.2 Test Frontend

1. Buka: `https://doneright-xxx.vercel.app`
2. Klik "Login"
3. Login dengan:
   - Email: `admin@gmail.com`
   - Password: [password dari database Anda]
4. Harusnya masuk ke dashboard ✅

### 3.3 Test Full Integration

1. Login sebagai user
2. Tambah tugas baru
3. Refresh halaman
4. **Data tetap ada** = ✅ Success! Data persisten di Supabase

---

## Part 4: Custom Domain (Optional)

### 4.1 Vercel Custom Domain

1. Di Vercel dashboard → Settings → Domains
2. Add domain: `yourdomain.com`
3. Update DNS records sesuai instruksi Vercel
4. Tunggu propagasi (~10-60 menit)

### 4.2 Update Backend CORS

Jika pakai custom domain, update backend `server.js`:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

Deploy ulang backend.

---

## Troubleshooting

### ❌ Frontend: "Failed to fetch"

**Penyebab:**
- Backend belum deploy / down
- `VITE_API_URL` salah

**Solusi:**
1. Test backend URL di browser
2. Cek Environment Variables di Vercel
3. Rebuild frontend:
   ```bash
   vercel --prod
   ```

### ❌ Backend: "Database connection failed"

**Penyebab:**
- `DATABASE_URL` salah
- Supabase project down

**Solusi:**
1. Cek DATABASE_URL di Render Environment Variables
2. Test koneksi dari local:
   ```bash
   psql "postgresql://postgres:Done_Right-05@db.mmdrzvvnmoplbdfaiixx.supabase.co:5432/postgres"
   ```
3. Restart Render service

### ❌ Vercel Build Error: "Module not found"

**Penyebab:**
- Dependencies tidak terinstall

**Solusi:**
1. Pastikan `package.json` lengkap
2. Cek logs di Vercel dashboard
3. Rebuild:
   ```bash
   vercel --prod --force
   ```

### ❌ Render: Free instance sleeps

**Penyebab:**
- Render free tier sleep setelah 15 menit tidak ada traffic

**Solusi:**
- Cold start ~30 detik saat pertama kali diakses
- Upgrade ke paid plan ($7/month) untuk always-on

---

## Update Code

### Update Frontend

```bash
git add .
git commit -m "Update feature X"
git push
```

Vercel akan auto-deploy dalam 2-3 menit.

### Update Backend

```bash
git add backend/
git commit -m "Update backend feature Y"
git push
```

Render akan auto-deploy dalam 3-5 menit.

---

## Monitoring

### Vercel Analytics

- Buka Vercel dashboard
- Klik project → Analytics
- Lihat traffic, performance, errors

### Render Logs

- Buka Render dashboard
- Klik service → Logs
- Monitor real-time logs
- Cek errors, requests

### Supabase Database

- Buka Supabase dashboard
- Table Editor: lihat data
- SQL Editor: run queries
- Database → Usage: monitor storage

---

## Cost Summary

| Service | Plan | Cost |
|---------|------|------|
| Vercel Frontend | Hobby | **Free** |
| Render Backend | Free | **Free** |
| Supabase Database | Free | **Free** |
| **TOTAL** | | **Rp 0/month** |

**Limits:**
- Vercel: 100GB bandwidth, unlimited deployments
- Render: 512MB RAM, sleeps after 15min
- Supabase: 500MB storage, 2GB bandwidth

---

## Production Checklist

Sebelum go-live:

- [ ] Ganti `JWT_SECRET` dengan random string yang kuat
- [ ] Ganti password admin default
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Setup custom domain (optional)
- [ ] Test semua fitur: login, CRUD, reports
- [ ] Monitor logs 24 jam pertama
- [ ] Setup error tracking (Sentry - optional)

---

## URLs Checklist

Simpan URLs ini:

- ✅ **Frontend**: `https://doneright-xxx.vercel.app`
- ✅ **Backend**: `https://doneright-backend.onrender.com`
- ✅ **Supabase**: `https://app.supabase.com/project/mmdrzvvnmoplbdfaiixx`
- ✅ **GitHub**: `https://github.com/USERNAME/REPO-NAME`

---

## Need Help?

1. **Vercel Issues**: https://vercel.com/docs
2. **Render Issues**: https://render.com/docs
3. **Supabase Issues**: https://supabase.com/docs

Good luck! 🚀

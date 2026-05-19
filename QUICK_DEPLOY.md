# Quick Deploy Guide - 5 Menit

## Prasyarat
- ✅ Akun GitHub
- ✅ Akun Vercel (daftar dengan GitHub)
- ✅ Akun Render (daftar dengan GitHub)
- ✅ Database Supabase sudah setup

## Step 1: Push ke GitHub (2 menit)

```bash
# Initialize git (jika belum)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create repo di GitHub, lalu:
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend ke Render (3 menit)

1. **Buka**: https://render.com/
2. **New +** → **Web Service**
3. **Connect** repository GitHub
4. **Settings**:
   - Name: `doneright-backend`
   - Root Directory: `backend`
   - Build: `pnpm install`
   - Start: `node server.js`
   - Free tier

5. **Environment Variables**:
   ```
   PORT=5000
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres:Done_Right-05@db.mmdrzvvnmoplbdfaiixx.supabase.co:5432/postgres
   JWT_SECRET=change_this_to_random_string
   ```

6. **Deploy** → Tunggu 3 menit

7. **Copy URL**: `https://doneright-backend-xxx.onrender.com`

## Step 3: Deploy Frontend ke Vercel (2 menit)

1. **Update .env** dengan backend URL dari Step 2:
   ```bash
   echo "VITE_API_URL=https://doneright-backend-xxx.onrender.com/api" > .env
   git add .env
   git commit -m "Add production API URL"
   git push
   ```

2. **Buka**: https://vercel.com/
3. **Import Project** → Pilih repo GitHub
4. **Settings** (auto-detect):
   - Framework: Vite
   - Build: `pnpm build`
   - Output: `dist`

5. **Environment Variables**:
   ```
   VITE_API_URL=https://doneright-backend-xxx.onrender.com/api
   ```

6. **Deploy** → Tunggu 2 menit

7. **Open** → `https://doneright-xxx.vercel.app`

## Step 4: Test (1 menit)

1. Buka frontend URL
2. Login dengan email dari database
3. Create task baru
4. Refresh halaman
5. ✅ Data tetap ada = SUCCESS!

---

## Troubleshooting Cepat

### Frontend tidak bisa connect ke backend
```bash
# Cek Environment Variable di Vercel
# Pastikan VITE_API_URL benar (harus ada /api di akhir)
```

### Backend error saat start
```bash
# Cek Render logs
# Pastikan DATABASE_URL benar
# Pastikan semua dependencies di package.json
```

### Build error di Vercel
```bash
# Cek build logs
# Test local: pnpm build
# Pastikan package.json lengkap
```

---

## URLs Penting

Simpan URLs ini:

- Frontend: `https://_____.vercel.app`
- Backend: `https://_____.onrender.com`
- GitHub: `https://github.com/_____/_____`
- Supabase: `https://app.supabase.com/project/_____`

---

**Total waktu: ~8 menit**
**Total biaya: Rp 0 (semua free tier)**

🎉 Selesai! Aplikasi Anda sudah live!

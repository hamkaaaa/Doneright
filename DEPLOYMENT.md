# 🚀 Panduan Deploy ke Vercel

## Persiapan

1. Pastikan semua file sudah di-commit ke Git repository (GitHub/GitLab/Bitbucket)
2. Pastikan `package.json`, `vercel.json`, dan `vite.config.ts` sudah sesuai
3. Sudah memiliki akun Vercel (gratis di vercel.com)

## Metode 1: Deploy via Vercel Dashboard (Recommended)

### Langkah-langkah:

1. **Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - DoneRight Task Manager"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```

2. **Import ke Vercel**
   - Buka https://vercel.com/new
   - Pilih "Import Git Repository"
   - Pilih repository GitHub Anda
   - Vercel akan otomatis mendeteksi framework (Vite)

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build` (otomatis terdeteksi)
   - **Output Directory**: `dist` (otomatis terdeteksi)
   - **Install Command**: `pnpm install` (otomatis terdeteksi)

4. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build selesai (±1-2 menit)
   - Aplikasi akan live di `https://your-project.vercel.app`

## Metode 2: Deploy via Vercel CLI

### Install Vercel CLI:

```bash
npm i -g vercel
```

### Login:

```bash
vercel login
```

### Deploy:

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## Konfigurasi Domain Custom (Opsional)

1. Di Vercel Dashboard, buka project Anda
2. Pilih tab "Settings" → "Domains"
3. Tambahkan domain custom Anda
4. Ikuti instruksi DNS dari Vercel

## Auto-Deploy dari Git

Setelah setup awal, setiap push ke branch `main` akan otomatis trigger deployment baru:

```bash
git add .
git commit -m "Update fitur XYZ"
git push origin main
```

Vercel akan otomatis:
- Detect perubahan
- Build ulang aplikasi
- Deploy ke production

## Monitoring & Logs

- **Dashboard**: https://vercel.com/dashboard
- **Analytics**: Lihat traffic, performance metrics
- **Logs**: Lihat build logs dan runtime logs

## Environment Variables (Jika Diperlukan)

Jika aplikasi memerlukan environment variables:

1. Buka Project Settings di Vercel
2. Pilih tab "Environment Variables"
3. Tambahkan variabel:
   - `VITE_API_URL` = URL backend API Anda
   - `VITE_APP_NAME` = DoneRight
   - dll.

## Troubleshooting

### Build Failed

Cek build logs di Vercel Dashboard untuk error details. Common issues:
- Missing dependencies → Cek `package.json`
- TypeScript errors → Run `tsc --noEmit` locally
- Import errors → Cek path imports

### Deploy Sukses tapi Blank Page

- Cek browser console untuk errors
- Pastikan `index.html` ada di root
- Cek `vite.config.ts` base path

### 404 on Refresh

Sudah di-handle oleh `vercel.json` rewrites. Jika masih terjadi:
- Pastikan `vercel.json` ada dan benar
- Re-deploy project

## Performance Optimization

Untuk production, pertimbangkan:

1. **Code Splitting**: Sudah otomatis di Vite
2. **Image Optimization**: Gunakan Vercel Image Optimization
3. **Caching**: Vercel otomatis handle caching
4. **Compression**: Gzip/Brotli otomatis enabled

## URLs

Setelah deploy, Anda akan mendapat:
- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://your-project-git-branch.vercel.app` (untuk setiap branch)

---

**Selamat! Aplikasi DoneRight Anda sudah live! 🎉**

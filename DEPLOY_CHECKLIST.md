# ✅ Deployment Checklist

Gunakan checklist ini sebelum deploy ke production:

## Pre-Deployment

- [ ] Semua fitur sudah ditest secara lokal
- [ ] Build berhasil: `pnpm build`
- [ ] Dev server berjalan: `pnpm dev`
- [ ] Tidak ada error di console browser
- [ ] Semua use cases berfungsi
- [ ] Login credentials tested (mahasiswa & admin)

## Git Repository

- [ ] Repository GitHub sudah dibuat
- [ ] Code sudah di-push ke GitHub:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/USERNAME/REPO.git
  git push -u origin main
  ```

## Vercel Setup

- [ ] Akun Vercel sudah dibuat (vercel.com)
- [ ] Repository sudah di-import ke Vercel
- [ ] Build settings sudah benar:
  - Framework: Vite ✓
  - Build Command: `pnpm build` ✓
  - Output Directory: `dist` ✓
  - Install Command: `pnpm install` ✓

## First Deployment

- [ ] Deploy button clicked
- [ ] Build successful (check logs)
- [ ] Preview URL accessible
- [ ] App loads without errors
- [ ] Test login (mahasiswa & admin)
- [ ] Test all major features

## Post-Deployment

- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)
- [ ] Performance checked (Lighthouse score)
- [ ] Mobile responsive verified
- [ ] Browser compatibility tested

## Production URL

Production URL: `_______________________`

Preview URL: `_______________________`

## Notes

Tambahkan catatan deployment di sini:

---

**Last Updated:** _____________

**Deployed By:** _____________

**Status:** [ ] In Progress  [ ] Deployed  [ ] Live

# DoneRight - Task Management System

Sistem manajemen tugas untuk mahasiswa dengan fitur lengkap untuk mengelola, memantau, dan melacak progress tugas.

## 🚀 Fitur Utama

### Untuk Mahasiswa
- ✅ Manajemen tugas (CRUD)
- ✅ Filter & pencarian tugas
- ✅ Sorting berdasarkan deadline/prioritas
- ✅ Tampilan per kategori
- ✅ Progress tracking
- ✅ Generate laporan pribadi (CSV)
- ✅ Prioritas tugas (High/Medium/Low)
- ✅ Status tracking (Active/Completed/Overdue)

### Untuk Admin
- ✅ Monitoring seluruh tugas mahasiswa
- ✅ Statistik produktivitas sistem
- ✅ Monitoring tugas overdue
- ✅ Kelola kategori tugas
- ✅ Generate laporan sistem (CSV)

## 🛠️ Tech Stack

- **Frontend**: React 18.3 + TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 6.3
- **Package Manager**: pnpm

## 📦 Instalasi

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) atau npm

### Install Dependencies

```bash
pnpm install
```

atau jika menggunakan npm:

```bash
npm install
```

## 🏃 Development

Jalankan development server:

```bash
pnpm dev
```

atau:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🏗️ Build Production

Build untuk production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

## 🚢 Deploy ke Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login ke Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Deploy ke production:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Push code ke GitHub repository
2. Buka [Vercel Dashboard](https://vercel.com/new)
3. Import repository GitHub Anda
4. Vercel akan otomatis mendeteksi konfigurasi dari `vercel.json`
5. Klik "Deploy"

### Environment Variables (Opsional)

Jika menggunakan backend API, tambahkan environment variables di Vercel Dashboard:

```
VITE_API_URL=https://your-api-url.com
```

## 👤 Demo Credentials

### Mahasiswa
- Email: `mahasiswa@undip.ac.id`
- Password: `mahasiswa123`

### Admin
- Email: `admin@doneright.com`
- Password: `admin123`

## 📁 Project Structure

```
src/
├── app/
│   ├── App.tsx              # Main app component
│   └── components/
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       ├── StudentDashboard.tsx
│       ├── AdminDashboard.tsx
│       └── UserFlowDiagram.tsx
├── styles/
│   ├── theme.css           # Tailwind theme & tokens
│   └── fonts.css           # Font imports
└── main.tsx                # App entry point

index.html                  # HTML entry point
vite.config.ts             # Vite configuration
vercel.json                # Vercel deployment config
```

## 🎨 Use Cases Implemented

Semua 23 use case telah diimplementasi:

- UC00: Register
- UC01: Login Mahasiswa
- UC02: Tambah Tugas
- UC03: Validasi Input
- UC04: Lihat Daftar Tugas
- UC05: Edit Tugas
- UC06: Hapus Tugas (Soft Delete)
- UC07: Tandai Tugas Selesai
- UC08: Cari Tugas
- UC09: Filter Tugas
- UC10: Sorting Tugas
- UC11: Atur Prioritas
- UC12: Atur Deadline
- UC13: Lihat Progress
- UC14: Login Admin
- UC15: Monitoring Seluruh Tugas
- UC16: Monitoring Tugas Overdue
- UC17: Monitoring Statistik Produktivitas
- UC18: Kelola Kategori Tugas
- UC19: Generate Laporan (Admin)
- UC20: Lihat Detail Tugas
- UC21: Kelompokkan Tugas per Kategori
- UC22: Generate Laporan Pribadi (Mahasiswa)

## 📝 License

MIT License - Free to use for educational purposes

## 👥 Contributors

Developed as part of Software Engineering (RPL) course project at Universitas Diponegoro.

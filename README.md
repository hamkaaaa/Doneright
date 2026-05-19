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

### Frontend
- **Framework**: React 18.3 + TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 6.3
- **Package Manager**: pnpm

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT
- **Password Hashing**: bcryptjs

## 📦 Instalasi

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) atau npm
- Akun [Supabase](https://supabase.com) untuk database

### 1. Install Dependencies

**Frontend:**
```bash
pnpm install
```

**Backend:**
```bash
cd backend
pnpm install
```

### 2. Setup Database

1. Buat project baru di [Supabase](https://supabase.com)
2. Copy connection string dari Settings > Database
3. Jalankan schema SQL:
   - Buka `backend/schema.sql`
   - Copy semua isi file
   - Paste dan jalankan di Supabase SQL Editor

### 3. Setup Environment Variables

**Frontend** (root folder):
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
NODE_ENV=development
```

## 🏃 Development

### Jalankan Backend Server

```bash
cd backend
pnpm dev
```

Backend akan berjalan di `http://localhost:5000`

### Jalankan Frontend (terminal baru)

```bash
pnpm dev
```

Frontend akan berjalan di `http://localhost:3000`

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
├── src/                    # Frontend source
│   ├── app/
│   │   ├── App.tsx              # Main app component
│   │   └── components/
│   │       ├── LoginPage.tsx
│   │       ├── RegisterPage.tsx
│   │       ├── StudentDashboard.tsx
│   │       ├── AdminDashboard.tsx
│   │       └── UserFlowDiagram.tsx
│   ├── services/
│   │   └── api.ts              # API service layer
│   └── styles/
│       ├── theme.css           # Tailwind theme & tokens
│       └── fonts.css           # Font imports
├── backend/                # Backend source
│   ├── src/
│   │   ├── db/
│   │   │   └── database.ts     # Database connection
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT authentication
│   │   └── routes/
│   │       ├── auth.ts         # Auth endpoints
│   │       ├── tasks.ts        # Tasks endpoints
│   │       ├── categories.ts   # Categories endpoints
│   │       └── admin.ts        # Admin endpoints
│   ├── server.ts           # Main server file
│   ├── schema.sql          # Database schema
│   └── package.json        # Backend dependencies
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Frontend dependencies
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

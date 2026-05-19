# DoneRight Backend API

Backend API untuk aplikasi DoneRight Task Manager yang dibangun dengan Express.js, TypeScript, PostgreSQL (Supabase), dan JWT authentication.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 18+ terinstall
- npm atau pnpm
- Akun Supabase (untuk database PostgreSQL)

## Setup

### 1. Install Dependencies

```bash
cd backend
pnpm install
```

### 2. Setup Database

1. Buat project baru di [Supabase](https://supabase.com)
2. Copy connection string dari Settings > Database
3. Jalankan schema SQL di SQL Editor Supabase:
   - Buka file `schema.sql`
   - Copy semua isi file
   - Paste dan jalankan di Supabase SQL Editor

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan konfigurasi Anda:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
NODE_ENV=development
```

### 4. Run Server

**Development mode** (dengan auto-reload):
```bash
pnpm dev
```

**Production mode**:
```bash
pnpm start
```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

### Tasks (Protected)

- `GET /api/tasks` - Get semua tasks user
- `POST /api/tasks` - Create task baru
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Soft delete task
- `PATCH /api/tasks/toggle/:id` - Toggle status task (ACTIVE/COMPLETED)
- `GET /api/tasks/trash` - Get deleted tasks
- `PATCH /api/tasks/restore/:id` - Restore task dari trash
- `DELETE /api/tasks/permanent/:id` - Permanent delete task

### Categories (Protected)

- `GET /api/categories` - Get semua categories
- `POST /api/categories` - Create category baru
- `DELETE /api/categories/:id` - Delete category

### Admin (Protected - Admin only)

- `GET /api/admin/tasks` - Get semua tasks (monitoring)
- `GET /api/admin/overdue` - Get overdue tasks
- `GET /api/admin/statistics` - Get system statistics
- `GET /api/admin/categories` - Get semua categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

## Database Schema

### Users Table
```sql
- id_users (UUID, PK)
- username (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- role (VARCHAR: 'mahasiswa' | 'admin')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Categories Table
```sql
- category_id (UUID, PK)
- category_name (VARCHAR)
- category_type (VARCHAR: 'default' | 'custom')
- created_at (TIMESTAMP)
```

### Tasks Table
```sql
- task_id (UUID, PK)
- user_id (UUID, FK → users)
- category_id (UUID, FK → categories)
- title (VARCHAR)
- description (TEXT)
- priority (VARCHAR: 'HIGH' | 'MEDIUM' | 'LOW')
- deadline (TIMESTAMP)
- status (VARCHAR: 'ACTIVE' | 'COMPLETED' | 'OVERDUE')
- completed_at (TIMESTAMP)
- deleted_at (TIMESTAMP, untuk soft delete)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Features

- ✅ JWT-based authentication
- ✅ Role-based access control (mahasiswa/admin)
- ✅ Soft delete pattern
- ✅ Auto-update overdue tasks (cron job setiap jam)
- ✅ Password hashing dengan bcrypt
- ✅ CORS enabled
- ✅ TypeScript untuk type safety
- ✅ Error handling middleware

## Default Admin Account

```
Email: admin@doneright.com
Password: admin123
```

**⚠️ PENTING**: Ganti password admin setelah setup!

## Development

File structure:
```
backend/
├── src/
│   ├── db/
│   │   └── database.ts       # Database connection
│   ├── middleware/
│   │   └── auth.ts            # JWT middleware
│   └── routes/
│       ├── auth.ts            # Auth routes
│       ├── tasks.ts           # Tasks routes
│       ├── categories.ts      # Categories routes
│       └── admin.ts           # Admin routes
├── server.ts                  # Main server file
├── schema.sql                 # Database schema
├── package.json
├── tsconfig.json
└── .env
```

## Troubleshooting

**Database connection error:**
- Pastikan DATABASE_URL benar
- Cek Supabase project status
- Pastikan IP Anda diizinkan (Supabase Settings > Database > Connection Pooling)

**JWT error:**
- Pastikan JWT_SECRET sudah di-set di .env
- Cek format token di Authorization header: `Bearer <token>`

**CORS error:**
- Pastikan frontend URL sudah di-allow di CORS config
- Default: semua origin diizinkan untuk development

## License

MIT

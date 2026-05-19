# 🚀 Backend Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase)

## Environment Variables

Create `.env` file di folder Backend dengan isi:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:Done_Right-05@db.mmdrzvvnmoplbdfaiixx.supabase.co:5432/postgres
JWT_SECRET=doneright_secret
```

## Installation & Running

### 1. Clone Backend Repository
```bash
git clone https://github.com/lanjarset1awan/DoneRight.git
cd DoneRight/Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
Database sudah tersedia di Supabase. Pastikan tabel sudah dibuat sesuai schema.

### 4. Run Backend Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Backend akan running di `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

### Tasks (Requires JWT Token)
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Soft delete task
- `PATCH /api/tasks/toggle/:id` - Toggle complete
- `GET /api/tasks/trash` - Get deleted tasks
- `PATCH /api/tasks/restore/:id` - Restore deleted task
- `DELETE /api/tasks/permanent/:id` - Permanent delete

### Categories (Requires JWT Token)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `DELETE /api/categories/:id` - Delete category

### Admin (Requires JWT Token + Admin Role)
- `GET /api/admin/tasks` - Get all users tasks
- `GET /api/admin/overdue` - Get overdue tasks
- `GET /api/admin/statistics` - Get system statistics
- `GET /api/admin/categories` - Get categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

## Testing API

### Using curl:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Frontend Integration

Frontend sudah dikonfigurasi untuk connect ke backend di `http://localhost:5000/api`

Update `.env` di folder frontend jika backend URL berbeda:
```env
VITE_API_URL=http://localhost:5000/api
```

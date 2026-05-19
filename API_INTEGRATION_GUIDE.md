# 📡 API Integration Guide - Frontend ↔️ Backend

## Status Integrasi

### ✅ SELESAI
- [x] API Service Layer (`src/services/api.ts`)
- [x] Environment Configuration (`.env`, `.env.example`)
- [x] LoginPage - Terkoneksi dengan backend
- [x] RegisterPage - Terkoneksi dengan backend
- [x] User Type Updated (id_users, username)

### 🔄 PERLU UPDATE

#### **StudentDashboard.tsx** - Requires Integration

**Import yang perlu ditambahkan:**
```typescript
import { useEffect } from 'react';
import { tasksAPI, categoriesAPI } from '../../services/api';
```

**Data Loading (useEffect):**
```typescript
useEffect(() => {
  loadTasks();
  loadCategories();
}, []);

const loadTasks = async () => {
  try {
    const response = await tasksAPI.getAll();
    setTasks(response.tasks);
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
};

const loadCategories = async () => {
  try {
    const response = await categoriesAPI.getAll();
    setCategories(response.categories);
  } catch (error) {
    console.error('Error loading categories:', error);
  }
};
```

**Handler Functions yang perlu diupdate:**

1. **handleAddTask:**
```typescript
const handleAddTask = async () => {
  if (!formData.title || !formData.deadline) {
    alert('Judul dan deadline harus diisi');
    return;
  }

  try {
    const taskData = {
      title: formData.title,
      description: formData.description,
      category_id: formData.category_id || null,
      priority: formData.priority,
      deadline: formData.deadline,
    };

    await tasksAPI.create(taskData);
    await loadTasks(); // Reload tasks
    
    setShowAddModal(false);
    setFormData({
      title: '',
      description: '',
      category_id: '',
      priority: 'MEDIUM',
      deadline: '',
    });
  } catch (error: any) {
    alert(error.message || 'Gagal menambah tugas');
  }
};
```

2. **handleEditTask:**
```typescript
const handleEditTask = async () => {
  if (!editingTask) return;

  try {
    const taskData = {
      title: editingTask.title,
      description: editingTask.description,
      category_id: editingTask.category_id || null,
      priority: editingTask.priority,
      deadline: editingTask.deadline,
    };

    await tasksAPI.update(editingTask.task_id, taskData);
    await loadTasks();
    
    setEditingTask(null);
    setShowDetailModal(false);
  } catch (error: any) {
    alert(error.message || 'Gagal mengupdate tugas');
  }
};
```

3. **handleDeleteTask:**
```typescript
const handleDeleteTask = async (taskId: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
    try {
      await tasksAPI.delete(taskId);
      await loadTasks();
      setShowDetailModal(false);
    } catch (error: any) {
      alert(error.message || 'Gagal menghapus tugas');
    }
  }
};
```

4. **handleToggleComplete:**
```typescript
const handleToggleComplete = async (taskId: string) => {
  try {
    await tasksAPI.toggleComplete(taskId);
    await loadTasks();
  } catch (error: any) {
    alert(error.message || 'Gagal mengupdate status');
  }
};
```

**State yang perlu diubah:**
```typescript
// Before (mock data)
const [tasks, setTasks] = useState<Task[]>([...hardcoded data...]);
const [categories] = useState<Category[]>([...hardcoded...]);

// After (empty, akan di-load dari API)
const [tasks, setTasks] = useState<Task[]>([]);
const [categories, setCategories] = useState<Category[]>([]);
const [loading, setLoading] = useState(true);
```

#### **AdminDashboard.tsx** - Requires Integration

**Import:**
```typescript
import { useEffect } from 'react';
import { adminAPI } from '../../services/api';
```

**Data Loading:**
```typescript
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    const [tasksRes, statsRes, categoriesRes] = await Promise.all([
      adminAPI.getAllTasks(),
      adminAPI.getStatistics(),
      adminAPI.getCategories()
    ]);

    setAllTasks(tasksRes.tasks);
    setStatistics(statsRes);
    setCategories(categoriesRes.categories);
  } catch (error) {
    console.error('Error loading admin data:', error);
  }
};
```

**Handler Functions:**
```typescript
const handleAddCategory = async () => {
  if (!newCategoryName.trim()) {
    alert('Nama kategori tidak boleh kosong');
    return;
  }

  try {
    await adminAPI.createCategory(newCategoryName);
    await loadData();
    setNewCategoryName('');
    setShowAddCategoryModal(false);
  } catch (error: any) {
    alert(error.message || 'Gagal menambah kategori');
  }
};

const handleDeleteCategory = async (categoryId: string) => {
  if (confirm('Hapus kategori ini?')) {
    try {
      await adminAPI.deleteCategory(categoryId);
      await loadData();
    } catch (error: any) {
      alert(error.message || 'Gagal menghapus kategori');
    }
  }
};
```

## Backend Database Schema

Backend menggunakan PostgreSQL (Supabase) dengan tabel:

### **users**
- id_users (PK)
- username
- email
- password_hash
- role ('mahasiswa' | 'admin')
- created_at
- deleted_at

### **tasks**
- id_tasks (PK)
- user_id (FK → users)
- category_id (FK → categories, nullable)
- title
- description
- priority ('HIGH' | 'MEDIUM' | 'LOW')
- deadline (date)
- status ('ACTIVE' | 'COMPLETED' | 'OVERDUE')
- completed_at (nullable)
- created_at
- updated_at
- deleted_at

### **categories**
- id_categories (PK)
- name
- created_at

## Testing Integration

### 1. Start Backend
```bash
cd /path/to/DoneRight/Backend
npm run dev
# Server running at http://localhost:5000
```

### 2. Start Frontend
```bash
cd /path/to/frontend
pnpm dev
# App running at http://localhost:3000
```

### 3. Test Flow
1. Register new user
2. Login
3. Create tasks
4. Update tasks
5. Toggle complete
6. Delete tasks
7. Check data persists after refresh

## Troubleshooting

### CORS Error
Backend sudah enable CORS, tapi jika masih error:
```javascript
// Backend: src/index.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### 401 Unauthorized
Token mungkin expired atau tidak valid:
```typescript
// Clear token dan login ulang
localStorage.removeItem('token');
// Redirect to login
```

### Network Error
Pastikan:
- Backend running di port 5000
- Frontend `.env` correct: `VITE_API_URL=http://localhost:5000/api`
- No firewall blocking

## Deploy to Production

### Backend (Recommended: Render / Railway)
1. Push backend ke GitHub
2. Connect ke Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Update `.env` dengan production API URL:
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
2. Commit & push
3. Vercel auto-deploy

### Environment Variables di Vercel
```
VITE_API_URL=https://your-backend-api.com/api
```

---

**Next Steps:** Update StudentDashboard.tsx dan AdminDashboard.tsx sesuai panduan ini.

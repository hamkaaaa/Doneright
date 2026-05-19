import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import tasksRoutes from './src/routes/tasks.js';
import categoriesRoutes from './src/routes/categories.js';
import adminRoutes from './src/routes/admin.js';
import pool from './src/db/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'DoneRight API Server is running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

// Cron job to update overdue tasks
const updateOverdueTasks = async () => {
  try {
    await pool.query(
      "UPDATE tasks SET status = 'OVERDUE' WHERE deadline < NOW() AND status = 'ACTIVE' AND deleted_at IS NULL"
    );
    console.log('✅ Overdue tasks updated');
  } catch (error) {
    console.error('❌ Error updating overdue tasks:', error);
  }
};

// Run cron job every hour
setInterval(updateOverdueTasks, 60 * 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  // Run initial overdue check
  updateOverdueTasks();
});

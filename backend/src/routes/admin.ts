import express from 'express';
import pool from '../db/database.js';
import { authenticateToken, authenticateAdmin, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateToken);
router.use(authenticateAdmin);

// Get all tasks (admin monitoring)
router.get('/tasks', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE deleted_at IS NULL ORDER BY created_at DESC'
    );

    const tasks = result.rows.map(task => ({
      task_id: task.id_tasks.toString(),
      user_id: task.user_id.toString(),
      category_id: task.category_id ? task.category_id.toString() : null,
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline,
      status: task.is_completed ? 'COMPLETED' : (new Date(task.deadline) < new Date() && !task.is_completed ? 'OVERDUE' : 'ACTIVE'),
      completed_at: task.completed_at,
      created_at: task.created_at
    }));

    res.json({ tasks });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Get overdue tasks
router.get('/overdue', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE deadline < NOW() AND is_completed = false AND deleted_at IS NULL ORDER BY deadline ASC"
    );

    const tasks = result.rows.map(task => ({
      task_id: task.id_tasks.toString(),
      user_id: task.user_id.toString(),
      category_id: task.category_id ? task.category_id.toString() : null,
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline,
      status: 'OVERDUE',
      created_at: task.created_at
    }));

    res.json({ tasks });
  } catch (error) {
    console.error('Get overdue tasks error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Get statistics
router.get('/statistics', async (req: AuthRequest, res) => {
  try {
    const totalResult = await pool.query(
      'SELECT COUNT(*) as total FROM tasks WHERE deleted_at IS NULL'
    );

    const completedResult = await pool.query(
      "SELECT COUNT(*) as completed FROM tasks WHERE is_completed = true AND deleted_at IS NULL"
    );

    const activeResult = await pool.query(
      "SELECT COUNT(*) as active FROM tasks WHERE is_completed = false AND deadline >= NOW() AND deleted_at IS NULL"
    );

    const overdueResult = await pool.query(
      "SELECT COUNT(*) as overdue FROM tasks WHERE is_completed = false AND deadline < NOW() AND deleted_at IS NULL"
    );

    const highPriorityResult = await pool.query(
      "SELECT COUNT(*) as high FROM tasks WHERE priority = 'HIGH' AND deleted_at IS NULL"
    );

    const mediumPriorityResult = await pool.query(
      "SELECT COUNT(*) as medium FROM tasks WHERE priority = 'MEDIUM' AND deleted_at IS NULL"
    );

    const lowPriorityResult = await pool.query(
      "SELECT COUNT(*) as low FROM tasks WHERE priority = 'LOW' AND deleted_at IS NULL"
    );

    const total = parseInt(totalResult.rows[0].total);
    const completed = parseInt(completedResult.rows[0].completed);
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      total,
      completed,
      active: parseInt(activeResult.rows[0].active),
      overdue: parseInt(overdueResult.rows[0].overdue),
      completionRate,
      highPriority: parseInt(highPriorityResult.rows[0].high),
      mediumPriority: parseInt(mediumPriorityResult.rows[0].medium),
      lowPriority: parseInt(lowPriorityResult.rows[0].low)
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Get all categories (global only for admin)
router.get('/categories', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE is_global = true ORDER BY created_at ASC'
    );

    const categories = result.rows.map(cat => ({
      category_id: cat.id_categories.toString(),
      category_name: cat.name,
      category_type: 'default',
      created_at: cat.created_at
    }));

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Create global category (admin)
router.post('/categories', async (req: AuthRequest, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Nama kategori harus diisi' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO categories (name, user_id, is_global) VALUES ($1, NULL, $2) RETURNING *',
      [name, true]
    );

    const cat = result.rows[0];
    res.status(201).json({
      message: 'Kategori berhasil ditambahkan',
      category: {
        category_id: cat.id_categories.toString(),
        category_name: cat.name,
        category_type: 'default',
        created_at: cat.created_at
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Update category (admin)
router.put('/categories/:id', async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Nama kategori harus diisi' });
  }

  try {
    const result = await pool.query(
      'UPDATE categories SET name = $1 WHERE id_categories = $2 RETURNING *',
      [name, parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    const cat = result.rows[0];
    res.json({
      message: 'Kategori berhasil diupdate',
      category: {
        category_id: cat.id_categories.toString(),
        category_name: cat.name,
        category_type: cat.is_global ? 'default' : 'custom',
        created_at: cat.created_at
      }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Delete category (admin, only global categories)
router.delete('/categories/:id', async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    // Check if category is global
    const categoryCheck = await pool.query(
      'SELECT is_global FROM categories WHERE id_categories = $1',
      [parseInt(id)]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    if (!categoryCheck.rows[0].is_global) {
      return res.status(403).json({ message: 'Hanya kategori global yang dapat dihapus oleh admin' });
    }

    // Set category_id to NULL for tasks using this category
    await pool.query(
      'UPDATE tasks SET category_id = NULL WHERE category_id = $1',
      [parseInt(id)]
    );

    // Delete category
    await pool.query('DELETE FROM categories WHERE id_categories = $1', [parseInt(id)]);

    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

export default router;

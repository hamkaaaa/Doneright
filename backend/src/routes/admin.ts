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
    res.json({ tasks: result.rows });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Get overdue tasks
router.get('/overdue', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE status = 'OVERDUE' AND deleted_at IS NULL ORDER BY deadline ASC"
    );
    res.json({ tasks: result.rows });
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
      "SELECT COUNT(*) as completed FROM tasks WHERE status = 'COMPLETED' AND deleted_at IS NULL"
    );

    const activeResult = await pool.query(
      "SELECT COUNT(*) as active FROM tasks WHERE status = 'ACTIVE' AND deleted_at IS NULL"
    );

    const overdueResult = await pool.query(
      "SELECT COUNT(*) as overdue FROM tasks WHERE status = 'OVERDUE' AND deleted_at IS NULL"
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

// Get all categories
router.get('/categories', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY created_at ASC'
    );
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Create category (admin)
router.post('/categories', async (req: AuthRequest, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Nama kategori harus diisi' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO categories (category_name, category_type) VALUES ($1, $2) RETURNING *',
      [name, 'custom']
    );
    res.status(201).json({ message: 'Kategori berhasil ditambahkan', category: result.rows[0] });
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
      'UPDATE categories SET category_name = $1 WHERE category_id = $2 RETURNING *',
      [name, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    res.json({ message: 'Kategori berhasil diupdate', category: result.rows[0] });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Delete category (admin)
router.delete('/categories/:id', async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    // Check if category is default
    const categoryCheck = await pool.query(
      'SELECT category_type FROM categories WHERE category_id = $1',
      [id]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    if (categoryCheck.rows[0].category_type === 'default') {
      return res.status(403).json({ message: 'Kategori default tidak dapat dihapus' });
    }

    // Set category_id to NULL for tasks using this category
    await pool.query(
      'UPDATE tasks SET category_id = NULL WHERE category_id = $1',
      [id]
    );

    // Delete category
    await pool.query('DELETE FROM categories WHERE category_id = $1', [id]);

    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

export default router;

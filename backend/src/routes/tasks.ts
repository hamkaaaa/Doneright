import express from 'express';
import pool from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for logged-in user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC',
      [req.user!.id_users]
    );
    res.json({ tasks: result.rows });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Create new task
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const { title, description, priority, deadline, category_id } = req.body;

  if (!title || !priority || !deadline) {
    return res.status(400).json({ message: 'Title, priority, dan deadline harus diisi' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, description, priority, deadline, category_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user!.id_users, title, description, priority, deadline, category_id || null, 'ACTIVE']
    );
    res.status(201).json({ message: 'Tugas berhasil ditambahkan', task: result.rows[0] });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Update task
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { title, description, priority, deadline, category_id } = req.body;

  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, priority = $3, deadline = $4, category_id = $5 WHERE task_id = $6 AND user_id = $7 AND deleted_at IS NULL RETURNING *',
      [title, description, priority, deadline, category_id || null, id, req.user!.id_users]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }

    res.json({ message: 'Tugas berhasil diupdate', task: result.rows[0] });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Soft delete task
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE tasks SET deleted_at = NOW() WHERE task_id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING *',
      [id, req.user!.id_users]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }

    res.json({ message: 'Tugas berhasil dihapus', task: result.rows[0] });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Toggle task completion
router.patch('/toggle/:id', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const taskResult = await pool.query(
      'SELECT status FROM tasks WHERE task_id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [id, req.user!.id_users]
    );

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }

    const currentStatus = taskResult.rows[0].status;
    const newStatus = currentStatus === 'COMPLETED' ? 'ACTIVE' : 'COMPLETED';
    const completedAt = newStatus === 'COMPLETED' ? new Date() : null;

    const result = await pool.query(
      'UPDATE tasks SET status = $1, completed_at = $2 WHERE task_id = $3 RETURNING *',
      [newStatus, completedAt, id]
    );

    res.json({ message: 'Status tugas berhasil diubah', task: result.rows[0] });
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Get trash (deleted tasks)
router.get('/trash', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 AND deleted_at IS NOT NULL ORDER BY deleted_at DESC',
      [req.user!.id_users]
    );
    res.json({ tasks: result.rows });
  } catch (error) {
    console.error('Get trash error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Restore task from trash
router.patch('/restore/:id', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE tasks SET deleted_at = NULL WHERE task_id = $1 AND user_id = $2 AND deleted_at IS NOT NULL RETURNING *',
      [id, req.user!.id_users]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan di trash' });
    }

    res.json({ message: 'Tugas berhasil dipulihkan', task: result.rows[0] });
  } catch (error) {
    console.error('Restore task error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Permanent delete
router.delete('/permanent/:id', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE task_id = $1 AND user_id = $2 AND deleted_at IS NOT NULL RETURNING *',
      [id, req.user!.id_users]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan di trash' });
    }

    res.json({ message: 'Tugas berhasil dihapus permanen' });
  } catch (error) {
    console.error('Permanent delete error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

export default router;

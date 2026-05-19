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

    // Transform database format to frontend format
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
      deleted_at: task.deleted_at,
      created_at: task.created_at
    }));

    res.json({ tasks });
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
      'INSERT INTO tasks (user_id, title, description, priority, deadline, category_id, is_completed) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user!.id_users, title, description, priority, deadline, category_id ? parseInt(category_id) : null, false]
    );

    const task = result.rows[0];
    res.status(201).json({
      message: 'Tugas berhasil ditambahkan',
      task: {
        task_id: task.id_tasks.toString(),
        user_id: task.user_id.toString(),
        category_id: task.category_id ? task.category_id.toString() : null,
        title: task.title,
        description: task.description,
        priority: task.priority,
        deadline: task.deadline,
        status: 'ACTIVE',
        created_at: task.created_at
      }
    });
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
      'UPDATE tasks SET title = $1, description = $2, priority = $3, deadline = $4, category_id = $5 WHERE id_tasks = $6 AND user_id = $7 AND deleted_at IS NULL RETURNING *',
      [title, description, priority, deadline, category_id ? parseInt(category_id) : null, parseInt(id), req.user!.id_users]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }

    const task = result.rows[0];
    res.json({
      message: 'Tugas berhasil diupdate',
      task: {
        task_id: task.id_tasks.toString(),
        user_id: task.user_id.toString(),
        category_id: task.category_id ? task.category_id.toString() : null,
        title: task.title,
        description: task.description,
        priority: task.priority,
        deadline: task.deadline,
        status: task.is_completed ? 'COMPLETED' : 'ACTIVE',
        completed_at: task.completed_at,
        created_at: task.created_at
      }
    });
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
      'UPDATE tasks SET deleted_at = NOW() WHERE id_tasks = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING *',
      [parseInt(id), req.user!.id_users]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }

    res.json({ message: 'Tugas berhasil dihapus' });
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
      'SELECT is_completed FROM tasks WHERE id_tasks = $1 AND user_id = $2 AND deleted_at IS NULL',
      [parseInt(id), req.user!.id_users]
    );

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }

    const currentCompleted = taskResult.rows[0].is_completed;
    const newCompleted = !currentCompleted;
    const completedAt = newCompleted ? new Date() : null;

    const result = await pool.query(
      'UPDATE tasks SET is_completed = $1, completed_at = $2 WHERE id_tasks = $3 RETURNING *',
      [newCompleted, completedAt, parseInt(id)]
    );

    const task = result.rows[0];
    res.json({
      message: 'Status tugas berhasil diubah',
      task: {
        task_id: task.id_tasks.toString(),
        user_id: task.user_id.toString(),
        category_id: task.category_id ? task.category_id.toString() : null,
        title: task.title,
        description: task.description,
        priority: task.priority,
        deadline: task.deadline,
        status: task.is_completed ? 'COMPLETED' : 'ACTIVE',
        completed_at: task.completed_at,
        created_at: task.created_at
      }
    });
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

    const tasks = result.rows.map(task => ({
      task_id: task.id_tasks.toString(),
      user_id: task.user_id.toString(),
      category_id: task.category_id ? task.category_id.toString() : null,
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline,
      status: task.is_completed ? 'COMPLETED' : 'ACTIVE',
      deleted_at: task.deleted_at,
      created_at: task.created_at
    }));

    res.json({ tasks });
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
      'UPDATE tasks SET deleted_at = NULL WHERE id_tasks = $1 AND user_id = $2 AND deleted_at IS NOT NULL RETURNING *',
      [parseInt(id), req.user!.id_users]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan di trash' });
    }

    res.json({ message: 'Tugas berhasil dipulihkan' });
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
      'DELETE FROM tasks WHERE id_tasks = $1 AND user_id = $2 AND deleted_at IS NOT NULL RETURNING *',
      [parseInt(id), req.user!.id_users]
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

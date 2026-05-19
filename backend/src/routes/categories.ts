import express from 'express';
import pool from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
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

// Create category (user can create custom categories)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
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

// Delete category (only custom categories can be deleted)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
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

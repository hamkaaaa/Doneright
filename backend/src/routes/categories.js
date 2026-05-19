import express from 'express';
import pool from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all categories (global + user's own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE is_global = true OR user_id = $1 ORDER BY created_at ASC',
      [req.user.id_users]
    );

    const categories = result.rows.map(cat => ({
      category_id: cat.id_categories.toString(),
      category_name: cat.name,
      category_type: cat.is_global ? 'default' : 'custom',
      created_at: cat.created_at
    }));

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Create category (user's custom category)
router.post('/', authenticateToken, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Nama kategori harus diisi' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO categories (name, user_id, is_global) VALUES ($1, $2, $3) RETURNING *',
      [name, req.user.id_users, false]
    );

    const cat = result.rows[0];
    res.status(201).json({
      message: 'Kategori berhasil ditambahkan',
      category: {
        category_id: cat.id_categories.toString(),
        category_name: cat.name,
        category_type: 'custom',
        created_at: cat.created_at
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Delete category (only user's own custom categories)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if category belongs to user and is not global
    const categoryCheck = await pool.query(
      'SELECT is_global, user_id FROM categories WHERE id_categories = $1',
      [parseInt(id)]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    const category = categoryCheck.rows[0];

    if (category.is_global) {
      return res.status(403).json({ message: 'Kategori global tidak dapat dihapus' });
    }

    if (category.user_id !== req.user.id_users) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses untuk menghapus kategori ini' });
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

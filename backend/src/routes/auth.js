import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/database.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  try {
    // Check if email already exists
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND role IS NOT NULL',
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user (use "user" role in database, frontend sees it as "mahasiswa")
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id_users, username, email, role',
      [username, email, hashedPassword, 'user']
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: {
        id_users: result.rows[0].id_users,
        username: result.rows[0].username,
        email: result.rows[0].email,
        role: 'mahasiswa'  // Send as "mahasiswa" to frontend
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password harus diisi' });
  }

  try {
    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND role IS NOT NULL',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Map database role to frontend role
    const frontendRole = user.role === 'user' ? 'mahasiswa' : user.role;

    // Generate JWT token
    const token = jwt.sign(
      {
        id_users: user.id_users,
        email: user.email,
        role: user.role  // Keep original for middleware
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id_users: user.id_users,
        username: user.username,
        email: user.email,
        role: frontendRole  // Send mapped role to frontend
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

export default router;

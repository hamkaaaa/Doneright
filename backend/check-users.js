import pool from './src/db/database.js';

async function checkUsers() {
  try {
    const result = await pool.query('SELECT id_users, username, email, role FROM users WHERE role IS NOT NULL LIMIT 10');
    console.log('=== EXISTING USERS ===');
    if (result.rows.length === 0) {
      console.log('No users found in database');
    } else {
      result.rows.forEach(user => {
        console.log(`ID: ${user.id_users}, Username, Email, Role);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

checkUsers();

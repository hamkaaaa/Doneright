import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:Done_Right-05@db.mmdrzvvnmoplbdfaiixx.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
  try {
    // Check tasks table columns
    const result = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'tasks'
      ORDER BY ordinal_position;
    `);

    console.log('=== TASKS TABLE COLUMNS ===');
    result.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });

    // Check categories table
    const catResult = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'categories'
      ORDER BY ordinal_position;
    `);

    console.log('\n=== CATEGORIES TABLE COLUMNS ===');
    catResult.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });

    // Check users table
    const userResult = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log('\n=== USERS TABLE COLUMNS ===');
    userResult.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();

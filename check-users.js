const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_jmsyacvHG0M1@ep-solitary-term-za3pj49b-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require' });

async function run() {
  const res = await pool.query('SELECT * FROM users');
  console.log("Users:", res.rows);
  process.exit(0);
}
run();

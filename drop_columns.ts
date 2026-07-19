import { sql } from 'drizzle-orm';
import { db } from './lib/db';

async function run() {
  await db.execute(sql`ALTER TABLE users DROP COLUMN IF EXISTS fal_api_key, DROP COLUMN IF EXISTS openai_api_key, DROP COLUMN IF EXISTS replicate_api_key, DROP COLUMN IF EXISTS google_api_key;`);
  console.log('Columns dropped successfully');
  process.exit(0);
}

run().catch(console.error);

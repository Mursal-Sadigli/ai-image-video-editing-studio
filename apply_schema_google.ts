import { db } from './lib/db';
async function run() {
  await db.execute('ALTER TABLE users ADD COLUMN IF NOT EXISTS google_api_key text;');
  console.log('Done Google API Key');
}
run().catch(console.error);

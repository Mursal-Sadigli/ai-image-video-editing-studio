import { db } from './lib/db';
async function run() {
  await db.execute('ALTER TABLE users ADD COLUMN IF NOT EXISTS fal_api_key text, ADD COLUMN IF NOT EXISTS replicate_api_key text, ADD COLUMN IF NOT EXISTS openai_api_key text;');
  console.log('Done');
}
run().catch(console.error);

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    await db.execute('ALTER TABLE users ADD COLUMN IF NOT EXISTS fal_api_key text, ADD COLUMN IF NOT EXISTS replicate_api_key text, ADD COLUMN IF NOT EXISTS openai_api_key text, ADD COLUMN IF NOT EXISTS google_api_key text;');
    return NextResponse.json({ success: true, message: "Columns added successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

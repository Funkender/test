import { NextResponse } from 'next/server';

export async function GET() {
  // Holt sich die geheimen Schlüssel direkt vom Vercel-Server
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/hans_brain?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      // Verhindert hartnäckiges Caching, damit Hans immer aktuell bleibt
      cache: 'no-store' 
    });
    
    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: 'Serverfehler: ' + error.message }, { status: 500 });
  }

}

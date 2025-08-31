import { NextRequest, NextResponse } from 'next/server';

// GET: Read a cookie by name (from query param)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  if (!name) {
    return NextResponse.json({ error: 'Missing cookie name' }, { status: 400 });
  }
  const value = request.cookies.get(name)?.value || null;
  return NextResponse.json({ name, value });
}

// POST: Set a cookie (expects { name: string, value: string, options?: object } in body)
export async function POST(request: NextRequest) {
  const { name, value, options } = await request.json();
  if (!name || typeof name !== 'string' || typeof value !== 'string') {
    return NextResponse.json({ error: 'Invalid name or value' }, { status: 400 });
  }
  const response = NextResponse.json({ success: true, name, value });
  console.log(name, value);
  
  response.cookies.set(name, value, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,
    sameSite: 'lax',
    ...(options || {})
  });
  return response;
}

// DELETE: Remove a cookie by name (expects { name: string } in body)
export async function DELETE(request: NextRequest) {
  const { name } = await request.json();
  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
  }
  const response = NextResponse.json({ success: true, name });
  response.cookies.set(name, '', {
    path: '/',
    maxAge: 0,
  });
  return response;
}

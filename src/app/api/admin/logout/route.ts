import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  
  // Clear the auth cookie by setting it to expire immediately
  cookieStore.set('admin_auth_token', '', {
    maxAge: 0,
    path: '/',
  });

  return NextResponse.json({ success: true });
}

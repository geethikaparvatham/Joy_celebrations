import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedUsername || !expectedPassword) {
      console.error("Admin credentials are not set in environment variables.");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    if (username === expectedUsername && password === expectedPassword) {
      // Valid credentials! Set a secure cookie
      const cookieStore = await cookies();
      
      // In a real production app, you would sign a JWT here. 
      // For this MVP, a random secure token is generated and set.
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      cookieStore.set('admin_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return NextResponse.json({ success: true });
    }

    // Invalid credentials
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 });
  }
}

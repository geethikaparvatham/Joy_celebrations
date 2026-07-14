import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    let expectedUsername = process.env.ADMIN_USERNAME || "joycelebrations@gmail.com";
    let expectedPassword = process.env.ADMIN_PASSWORD || "joyteam@123";

    try {
      const credentialsDoc = await getDoc(doc(db, "admin_settings", "credentials"));
      if (credentialsDoc.exists()) {
        const data = credentialsDoc.data();
        if (data.username) expectedUsername = data.username;
        if (data.password) expectedPassword = data.password;
      }
    } catch (e) {
      console.warn("Could not load credentials from Firestore, using defaults:", e);
    }

    if (username === expectedUsername && password === expectedPassword) {
      // Valid credentials! Set a secure cookie
      const cookieStore = await cookies();
      
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      cookieStore.set('admin_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      // Log the login timing
      try {
        const userAgent = request.headers.get('user-agent') || 'Unknown';
        // Simple extraction of browser info from user agent
        let browser = "Unknown Browser";
        if (userAgent.includes("Firefox")) browser = "Firefox";
        else if (userAgent.includes("Chrome")) browser = "Chrome";
        else if (userAgent.includes("Safari")) browser = "Safari";
        else if (userAgent.includes("Edge")) browser = "Edge";

        await addDoc(collection(db, "login_logs"), {
          username,
          timestamp: new Date().toISOString(),
          userAgent: browser,
          ip: request.headers.get('x-forwarded-for') || '127.0.0.1'
        });
      } catch (logError) {
        console.error("Error logging login timing:", logError);
      }

      return NextResponse.json({ success: true });
    }

    // Invalid credentials
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 });
  }
}

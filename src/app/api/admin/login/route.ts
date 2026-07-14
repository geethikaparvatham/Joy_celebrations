import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    let expectedUsername = process.env.ADMIN_USERNAME || "joycelebrations@gmail.com";
    let expectedPassword = process.env.ADMIN_PASSWORD || "joyteam@123";

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "joy-celebrations";

    // Use lightweight HTTP REST Fetch to retrieve stored credentials
    // This avoids using client Firestore SDK in Node.js server routes which hangs on serverless runtimes
    try {
      const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admin_settings/credentials`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (res.ok) {
        const data = await res.json();
        const fields = data.fields;
        const firestoreUsername = fields?.username?.stringValue;
        const firestorePassword = fields?.password?.stringValue;
        if (firestoreUsername) expectedUsername = firestoreUsername;
        if (firestorePassword) expectedPassword = firestorePassword;
      }
    } catch (e) {
      console.warn("Could not load credentials from Firestore REST API, using defaults:", e);
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

      // Log the login timing using Firestore REST API
      try {
        const userAgent = request.headers.get('user-agent') || 'Unknown';
        let browser = "Unknown Browser";
        if (userAgent.includes("Firefox")) browser = "Firefox";
        else if (userAgent.includes("Chrome")) browser = "Chrome";
        else if (userAgent.includes("Safari")) browser = "Safari";
        else if (userAgent.includes("Edge")) browser = "Edge";

        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

        await fetch(
          `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/login_logs`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: {
                username: { stringValue: username },
                timestamp: { stringValue: new Date().toISOString() },
                userAgent: { stringValue: browser },
                ip: { stringValue: ip }
              }
            }),
            signal: AbortSignal.timeout(4000)
          }
        );
      } catch (logError) {
        console.error("Error logging login timing via REST API:", logError);
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

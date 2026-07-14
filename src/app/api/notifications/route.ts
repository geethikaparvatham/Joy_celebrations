import { NextResponse } from 'next/server';

const RTDB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 
                 process.env.FIREBASE_DATABASE_URL || 
                 'https://joy-celebrations-default-rtdb.firebaseio.com';

// GET: fetch all notifications from Realtime DB
export async function GET() {
  try {
    const res = await fetch(`${RTDB_URL}/notifications.json`);
    const data = await res.json();

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ notifications: [] });
    }

    // Firebase RTDB returns an object, convert to array
    const notifications = Object.values(data).filter(Boolean) as any[];

    // Sort newest first
    notifications.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("GET notifications error:", error);
    return NextResponse.json({ notifications: [], error: String(error) });
  }
}

// PATCH: mark notification as read or set action
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, markAll } = body;

    if (markAll) {
      // Fetch all and mark all as read
      const res = await fetch(`${RTDB_URL}/notifications.json`);
      const data = await res.json();
      if (data && typeof data === 'object') {
        await Promise.all(
          Object.keys(data).map(key =>
            fetch(`${RTDB_URL}/notifications/${key}/read.json`, {
              method: 'PUT',
              body: 'true',
              headers: { 'Content-Type': 'application/json' },
            })
          )
        );
      }
    } else if (id) {
      await fetch(`${RTDB_URL}/notifications/${id}/read.json`, {
        method: 'PUT',
        body: 'true',
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

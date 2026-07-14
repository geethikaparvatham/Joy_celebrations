import { NextResponse } from 'next/server';

const RTDB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 
                 process.env.FIREBASE_DATABASE_URL || 
                 'https://joy-celebrations-default-rtdb.firebaseio.com';

// GET: return all bookings
export async function GET() {
  try {
    const res = await fetch(`${RTDB_URL}/bookings.json`);
    const data = await res.json();

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ bookings: [] });
    }

    const bookings = Object.values(data).filter(Boolean) as any[];
    bookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ bookings: [], error: String(error) });
  }
}

// PATCH: update booking status (Confirmed / Cancelled) and mark notification read
export async function PATCH(request: Request) {
  try {
    const { bookingId, status, notificationId } = await request.json();

    if (bookingId && status) {
      await fetch(`${RTDB_URL}/bookings/${bookingId}/status.json`, {
        method: 'PUT',
        body: JSON.stringify(status),
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (notificationId) {
      await Promise.all([
        fetch(`${RTDB_URL}/notifications/${notificationId}/read.json`, {
          method: 'PUT',
          body: 'true',
          headers: { 'Content-Type': 'application/json' },
        }),
        fetch(`${RTDB_URL}/notifications/${notificationId}/action.json`, {
          method: 'PUT',
          body: JSON.stringify(status),
          headers: { 'Content-Type': 'application/json' },
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

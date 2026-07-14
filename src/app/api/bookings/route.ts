import { NextResponse } from 'next/server';

const CRUD_ENDPOINT = process.env.CRUD_ENDPOINT || '4cbef23d6ec041fa9094e952172dd331';
const BASE_URL = `https://crudcrud.com/api/${CRUD_ENDPOINT}`;

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/bookings`, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ bookings: [] });
    const data = await res.json();

    const bookings = Array.isArray(data) ? data : [];
    const mapped = bookings
      .map((b: any) => ({ ...b, id: b._id || b.bookingId }))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ bookings: mapped });
  } catch (error) {
    return NextResponse.json({ bookings: [], error: String(error) });
  }
}

export async function PATCH(request: Request) {
  try {
    const { bookingId, status, notificationId } = await request.json();

    // Update booking status
    if (bookingId && status) {
      const res = await fetch(`${BASE_URL}/bookings`, { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) {
        const booking = data.find((b: any) => b.bookingId === bookingId || b._id === bookingId);
        if (booking) {
          await fetch(`${BASE_URL}/bookings/${booking._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...booking, status }),
          });
        }
      }
    }

    // Update notification action
    if (notificationId) {
      const res = await fetch(`${BASE_URL}/notifications/${notificationId}`, { cache: 'no-store' });
      if (res.ok) {
        const n = await res.json();
        await fetch(`${BASE_URL}/notifications/${notificationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...n, read: true, action: status }),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

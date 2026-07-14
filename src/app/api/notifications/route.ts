import { NextResponse } from 'next/server';

const CRUD_ENDPOINT = process.env.CRUD_ENDPOINT || '4cbef23d6ec041fa9094e952172dd331';
const BASE_URL = `https://crudcrud.com/api/${CRUD_ENDPOINT}`;

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/notifications`, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ notifications: [] });
    const data = await res.json();
    
    // crudcrud returns an array directly
    const notifications = Array.isArray(data) ? data : [];
    
    // Map crudcrud's _id to id, sort newest first
    const mapped = notifications
      .map((n: any) => ({ ...n, id: n._id || n.notifId }))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ notifications: mapped });
  } catch (error) {
    console.error('GET notifications error:', error);
    return NextResponse.json({ notifications: [], error: String(error) });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, markAll } = body;

    if (markAll) {
      // Fetch all notifications and mark each as read
      const res = await fetch(`${BASE_URL}/notifications`, { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) {
        await Promise.all(
          data.map((n: any) =>
            fetch(`${BASE_URL}/notifications/${n._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...n, read: true }),
            })
          )
        );
      }
    } else if (id) {
      // Fetch the specific notification then update it
      const res = await fetch(`${BASE_URL}/notifications/${id}`, { cache: 'no-store' });
      if (res.ok) {
        const n = await res.json();
        await fetch(`${BASE_URL}/notifications/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...n, read: true }),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

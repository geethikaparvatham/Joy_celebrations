import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const RTDB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
                 'https://joy-celebrations-default-rtdb.firebaseio.com';

const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

async function readJsonFile(filePath: string): Promise<any[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

async function writeJsonFile(filePath: string, data: any[]) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function rtdbAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${RTDB_URL}/.json`, { method: 'GET' });
    return res.status !== 404;
  } catch { return false; }
}

export async function GET() {
  try {
    const useRtdb = await rtdbAvailable();

    if (useRtdb) {
      const res = await fetch(`${RTDB_URL}/bookings.json`);
      if (!res.ok) return NextResponse.json({ bookings: [] });
      const data = await res.json();

      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return NextResponse.json({ bookings: [] });
      }

      const bookings = Object.values(data)
        .filter((b: any) => b && typeof b === 'object' && b.id)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return NextResponse.json({ bookings });
    } else {
      const bookings = await readJsonFile(BOOKINGS_FILE);
      bookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return NextResponse.json({ bookings });
    }
  } catch (error) {
    return NextResponse.json({ bookings: [], error: String(error) });
  }
}

export async function PATCH(request: Request) {
  try {
    const { bookingId, status, notificationId } = await request.json();
    const useRtdb = await rtdbAvailable();

    if (useRtdb) {
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
            method: 'PUT', body: 'true',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch(`${RTDB_URL}/notifications/${notificationId}/action.json`, {
            method: 'PUT', body: JSON.stringify(status),
            headers: { 'Content-Type': 'application/json' },
          }),
        ]);
      }
    } else {
      // File fallback
      if (bookingId && status) {
        const bookings = await readJsonFile(BOOKINGS_FILE);
        const updated = bookings.map((b: any) => b.id === bookingId ? { ...b, status } : b);
        await writeJsonFile(BOOKINGS_FILE, updated);
      }
      if (notificationId) {
        const notifications = await readJsonFile(NOTIFICATIONS_FILE);
        const updated = notifications.map((n: any) =>
          n.id === notificationId ? { ...n, read: true, action: status } : n
        );
        await writeJsonFile(NOTIFICATIONS_FILE, updated);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

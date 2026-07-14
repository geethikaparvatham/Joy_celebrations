import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

async function readJson(filePath: string): Promise<any[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeJson(filePath: string, data: any[]) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET: return all bookings
export async function GET() {
  try {
    const bookings = await readJson(BOOKINGS_FILE);
    bookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ bookings: [], error: String(error) });
  }
}

// PATCH: update booking status (Confirmed / Cancelled)
export async function PATCH(request: Request) {
  try {
    const { bookingId, status, notificationId } = await request.json();

    // Update booking status
    if (bookingId && status) {
      const bookings = await readJson(BOOKINGS_FILE);
      const updated = bookings.map((b: any) =>
        b.id === bookingId ? { ...b, status } : b
      );
      await writeJson(BOOKINGS_FILE, updated);
    }

    // Also mark the notification as read
    if (notificationId) {
      const notifications = await readJson(NOTIFICATIONS_FILE);
      const updatedNotifs = notifications.map((n: any) =>
        n.id === notificationId ? { ...n, read: true, action: status } : n
      );
      await writeJson(NOTIFICATIONS_FILE, updatedNotifs);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

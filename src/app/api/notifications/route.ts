import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const RTDB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
                 'https://joy-celebrations-default-rtdb.firebaseio.com';

const DATA_DIR = path.join(process.cwd(), 'data');
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
      const res = await fetch(`${RTDB_URL}/notifications.json`);
      if (!res.ok) return NextResponse.json({ notifications: [] });
      const data = await res.json();

      // RTDB returns null when collection is empty
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return NextResponse.json({ notifications: [] });
      }

      // Convert RTDB object to array and validate each entry has required fields
      const notifications = Object.values(data)
        .filter((n: any) => n && typeof n === 'object' && n.id && n.type)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return NextResponse.json({ notifications });
    } else {
      // Fallback to file
      const notifications = await readJsonFile(NOTIFICATIONS_FILE);
      notifications.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return NextResponse.json({ notifications });
    }
  } catch (error) {
    console.error('GET notifications error:', error);
    return NextResponse.json({ notifications: [], error: String(error) });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, markAll } = body;
    const useRtdb = await rtdbAvailable();

    if (useRtdb) {
      if (markAll) {
        const res = await fetch(`${RTDB_URL}/notifications.json`);
        const data = await res.json();
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          await Promise.all(
            Object.keys(data).map(key =>
              fetch(`${RTDB_URL}/notifications/${key}/read.json`, {
                method: 'PUT', body: 'true',
                headers: { 'Content-Type': 'application/json' },
              })
            )
          );
        }
      } else if (id) {
        await fetch(`${RTDB_URL}/notifications/${id}/read.json`, {
          method: 'PUT', body: 'true',
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      const notifications = await readJsonFile(NOTIFICATIONS_FILE);
      const updated = markAll
        ? notifications.map(n => ({ ...n, read: true }))
        : notifications.map(n => n.id === id ? { ...n, read: true } : n);
      await writeJsonFile(NOTIFICATIONS_FILE, updated);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

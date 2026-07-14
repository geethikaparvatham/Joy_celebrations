import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
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

// GET: fetch all notifications
export async function GET() {
  try {
    const notifications = await readJson(NOTIFICATIONS_FILE);
    // Sort newest first
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ notifications: [], error: String(error) });
  }
}

// PATCH: mark a notification as read
export async function PATCH(request: Request) {
  try {
    const { id, markAll } = await request.json();
    const notifications = await readJson(NOTIFICATIONS_FILE);

    if (markAll) {
      const updated = notifications.map(n => ({ ...n, read: true }));
      await writeJson(NOTIFICATIONS_FILE, updated);
    } else if (id) {
      const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
      await writeJson(NOTIFICATIONS_FILE, updated);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

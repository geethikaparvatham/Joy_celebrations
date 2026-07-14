import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Firebase Realtime Database URL
const RTDB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
                 'https://joy-celebrations-default-rtdb.firebaseio.com';

// File-based fallback (works on localhost)
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
    // RTDB returns 200 (even for null data) when DB exists, 404 when it doesn't
    return res.status !== 404;
  } catch { return false; }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName, customerPhone, packageName, occasion,
      date, timeSlot, addons, totalAmount, paymentMethod,
    } = body;

    const createdAt = new Date().toISOString();
    const bookingId = `booking_${Date.now()}`;
    const notifId = `notif_${Date.now()}`;
    const totalStr = `₹${Number(totalAmount || 0).toLocaleString('en-IN')}`;

    const bookingData = {
      id: bookingId,
      customerName: customerName || 'Customer',
      customerPhone: customerPhone || '',
      packageName: packageName || 'TBD',
      occasion: occasion || 'TBD',
      date: date || 'TBD',
      timeSlot: timeSlot || 'TBD',
      addons: addons || [],
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || 'WhatsApp',
      status: 'Pending',
      createdAt,
    };

    const notificationData = {
      id: notifId,
      type: 'new_booking',
      title: 'New Booking Received! 🎉',
      message: `${customerName || 'Customer'} booked ${packageName || 'TBD'} for ${occasion || 'TBD'} on ${date || 'TBD'} at ${timeSlot || 'TBD'}. Total: ${totalStr}`,
      customerName: customerName || 'Customer',
      customerPhone: customerPhone || '',
      packageName: packageName || 'TBD',
      occasion: occasion || 'TBD',
      date: date || 'TBD',
      timeSlot: timeSlot || 'TBD',
      addons: addons || [],
      totalAmount: totalAmount || 0,
      bookingId,
      read: false,
      action: null,
      createdAt,
    };

    const useRtdb = await rtdbAvailable();

    if (useRtdb) {
      // Save to Firebase Realtime Database
      await fetch(`${RTDB_URL}/bookings/${bookingId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      await fetch(`${RTDB_URL}/notifications/${notifId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData),
      });
      console.log('✅ Saved to RTDB:', bookingId);
    } else {
      // Fallback: save to local JSON files (localhost dev)
      const bookings = await readJsonFile(BOOKINGS_FILE);
      bookings.unshift(bookingData);
      await writeJsonFile(BOOKINGS_FILE, bookings);

      const notifications = await readJsonFile(NOTIFICATIONS_FILE);
      notifications.unshift(notificationData);
      await writeJsonFile(NOTIFICATIONS_FILE, notifications);
      console.log('✅ Saved to local files:', bookingId);
    }

    return NextResponse.json({ success: true, bookingId });
  } catch (error) {
    console.error('Save booking error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

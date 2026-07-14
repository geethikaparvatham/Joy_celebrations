import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// Use /tmp for Vercel serverless, or local data dir for dev
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function readJson(filePath: string): Promise<any[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeJson(filePath: string, data: any[]) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(request: Request) {
  try {
    await ensureDataDir();

    const body = await request.json();
    const {
      customerName,
      customerPhone,
      packageName,
      occasion,
      date,
      timeSlot,
      addons,
      totalAmount,
      paymentMethod,
    } = body;

    const createdAt = new Date().toISOString();
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Save booking
    const bookings = await readJson(BOOKINGS_FILE);
    const newBooking = {
      id: bookingId,
      customerName: customerName || "Customer",
      customerPhone: customerPhone || "",
      packageName: packageName || "TBD",
      occasion: occasion || "TBD",
      date: date || "TBD",
      timeSlot: timeSlot || "TBD",
      addons: addons || [],
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || "WhatsApp",
      status: "Pending",
      createdAt,
    };
    bookings.unshift(newBooking);
    await writeJson(BOOKINGS_FILE, bookings);

    // Save notification
    const notifications = await readJson(NOTIFICATIONS_FILE);
    const totalStr = `₹${Number(totalAmount || 0).toLocaleString('en-IN')}`;
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: "new_booking",
      title: "New Booking Received! 🎉",
      message: `${customerName || "Customer"} booked ${packageName || "TBD"} for ${occasion || "TBD"} on ${date || "TBD"} at ${timeSlot || "TBD"}. Total: ${totalStr}`,
      customerName: customerName || "Customer",
      customerPhone: customerPhone || "",
      packageName: packageName || "TBD",
      occasion: occasion || "TBD",
      date: date || "TBD",
      timeSlot: timeSlot || "TBD",
      addons: addons || [],
      totalAmount: totalAmount || 0,
      bookingId,
      read: false,
      createdAt,
    };
    notifications.unshift(notification);
    await writeJson(NOTIFICATIONS_FILE, notifications);

    console.log("✅ Booking + notification saved:", bookingId);
    return NextResponse.json({ success: true, bookingId });

  } catch (error) {
    console.error("Save booking API error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

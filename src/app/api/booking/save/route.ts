import { NextResponse } from 'next/server';

// Firebase Realtime Database - works without auth in test mode
// Set RTDB_URL env var to your database URL like: https://joy-celebrations-default-rtdb.firebaseio.com
const RTDB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 
                 process.env.FIREBASE_DATABASE_URL || 
                 'https://joy-celebrations-default-rtdb.firebaseio.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName, customerPhone, packageName, occasion,
      date, timeSlot, addons, totalAmount, paymentMethod,
    } = body;

    const createdAt = new Date().toISOString();
    const bookingId = `booking_${Date.now()}`;

    const bookingData = {
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

    // Save booking to Realtime Database
    const bookingRes = await fetch(`${RTDB_URL}/bookings/${bookingId}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });

    if (!bookingRes.ok) {
      const err = await bookingRes.text();
      console.error("RTDB booking save failed:", err);
      throw new Error(`RTDB booking save failed: ${err}`);
    }

    // Save notification to Realtime Database
    const notifId = `notif_${Date.now()}`;
    const totalStr = `₹${Number(totalAmount || 0).toLocaleString('en-IN')}`;
    const notificationData = {
      id: notifId,
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
      action: null,
      createdAt,
    };

    const notifRes = await fetch(`${RTDB_URL}/notifications/${notifId}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData),
    });

    if (!notifRes.ok) {
      const err = await notifRes.text();
      console.error("RTDB notification save failed:", err);
    }

    console.log("✅ Booking + notification saved to RTDB:", bookingId);
    return NextResponse.json({ success: true, bookingId });

  } catch (error) {
    console.error("Save booking API error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "joy-celebrations";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

export async function POST(request: Request) {
  try {
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

    // Save booking to Firestore via REST API
    const bookingRes = await fetch(`${FIRESTORE_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          customerName: { stringValue: customerName || "Customer" },
          customerPhone: { stringValue: customerPhone || "" },
          packageName: { stringValue: packageName || "TBD" },
          occasion: { stringValue: occasion || "TBD" },
          date: { stringValue: date || "TBD" },
          timeSlot: { stringValue: timeSlot || "TBD" },
          addons: { arrayValue: { values: (addons || []).map((a: string) => ({ stringValue: a })) } },
          totalAmount: { integerValue: totalAmount || 0 },
          paymentMethod: { stringValue: paymentMethod || "WhatsApp" },
          status: { stringValue: "Pending" },
          createdAt: { stringValue: createdAt },
        }
      }),
      signal: AbortSignal.timeout(8000)
    });

    let bookingId = "";
    if (bookingRes.ok) {
      const bookingData = await bookingRes.json();
      // Extract document ID from the name field
      const nameParts = bookingData.name?.split('/');
      bookingId = nameParts?.[nameParts.length - 1] || "";
    } else {
      const errText = await bookingRes.text();
      console.error("Booking save error:", errText);
    }

    // Save notification to Firestore via REST API
    const totalStr = `₹${Number(totalAmount || 0).toLocaleString('en-IN')}`;
    const notificationRes = await fetch(`${FIRESTORE_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          type: { stringValue: "new_booking" },
          title: { stringValue: "New Booking Received! 🎉" },
          message: { stringValue: `${customerName || "Customer"} booked ${packageName || "TBD"} for ${occasion || "TBD"} on ${date || "TBD"} at ${timeSlot || "TBD"}. Total: ${totalStr}` },
          customerName: { stringValue: customerName || "Customer" },
          customerPhone: { stringValue: customerPhone || "" },
          packageName: { stringValue: packageName || "TBD" },
          occasion: { stringValue: occasion || "TBD" },
          date: { stringValue: date || "TBD" },
          timeSlot: { stringValue: timeSlot || "TBD" },
          totalAmount: { integerValue: totalAmount || 0 },
          bookingId: { stringValue: bookingId },
          read: { booleanValue: false },
          createdAt: { stringValue: createdAt },
        }
      }),
      signal: AbortSignal.timeout(8000)
    });

    if (!notificationRes.ok) {
      const errText = await notificationRes.text();
      console.error("Notification save error:", errText);
      return NextResponse.json({ success: false, error: "Failed to save notification", details: errText }, { status: 500 });
    }

    return NextResponse.json({ success: true, bookingId });
  } catch (error) {
    console.error("Save booking API error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

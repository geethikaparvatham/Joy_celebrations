import { NextResponse } from 'next/server';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "joy-celebrations";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

// GET: fetch all notifications
export async function GET() {
  try {
    const res = await fetch(
      `${FIRESTORE_BASE}/notifications?orderBy=createdAt+desc&pageSize=50`,
      { signal: AbortSignal.timeout(6000) }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ notifications: [], error: errText });
    }

    const data = await res.json();
    const docs = data.documents || [];

    const notifications = docs.map((doc: any) => {
      const f = doc.fields || {};
      const nameParts = doc.name?.split('/');
      const id = nameParts?.[nameParts.length - 1] || "";
      return {
        id,
        type: f.type?.stringValue || "new_booking",
        title: f.title?.stringValue || "New Booking",
        message: f.message?.stringValue || "",
        customerName: f.customerName?.stringValue || "",
        customerPhone: f.customerPhone?.stringValue || "",
        packageName: f.packageName?.stringValue || "",
        occasion: f.occasion?.stringValue || "",
        date: f.date?.stringValue || "",
        timeSlot: f.timeSlot?.stringValue || "",
        totalAmount: f.totalAmount?.integerValue || 0,
        bookingId: f.bookingId?.stringValue || "",
        read: f.read?.booleanValue || false,
        createdAt: f.createdAt?.stringValue || "",
      };
    });

    // Sort by createdAt descending
    notifications.sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ notifications: [], error: String(error) });
  }
}

// PATCH: mark a notification as read
export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: "No id provided" });

    const res = await fetch(
      `${FIRESTORE_BASE}/notifications/${id}?updateMask.fieldPaths=read`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: { read: { booleanValue: true } }
        }),
        signal: AbortSignal.timeout(6000)
      }
    );

    return NextResponse.json({ success: res.ok });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

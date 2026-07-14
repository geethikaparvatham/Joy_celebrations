import { NextResponse } from 'next/server';

// Free persistent REST database - no account/setup needed
// This endpoint is unique to this project and lasts ~1 week before needing renewal
const CRUD_ENDPOINT = process.env.CRUD_ENDPOINT || '4cbef23d6ec041fa9094e952172dd331';
const BASE_URL = `https://crudcrud.com/api/${CRUD_ENDPOINT}`;

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

    // Save booking
    const bookingData = {
      bookingId,
      customerName: customerName || 'Customer',
      customerPhone: customerPhone || '',
      packageName: packageName || 'TBD',
      occasion: occasion || 'TBD',
      date: date || 'TBD',
      timeSlot: timeSlot || 'TBD',
      addons: addons ? addons.join(', ') : '',
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || 'WhatsApp',
      status: 'Pending',
      createdAt,
    };

    await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });

    // Save notification
    const notificationData = {
      notifId,
      type: 'new_booking',
      title: 'New Booking Received! 🎉',
      message: `${customerName || 'Customer'} booked ${packageName || 'TBD'} for ${occasion || 'TBD'} on ${date || 'TBD'} at ${timeSlot || 'TBD'}. Total: ${totalStr}`,
      customerName: customerName || 'Customer',
      customerPhone: customerPhone || '',
      packageName: packageName || 'TBD',
      occasion: occasion || 'TBD',
      date: date || 'TBD',
      timeSlot: timeSlot || 'TBD',
      addons: addons ? addons.join(', ') : '',
      totalAmount: totalAmount || 0,
      bookingId,
      read: false,
      action: '',
      createdAt,
    };

    const notifRes = await fetch(`${BASE_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData),
    });

    const saved = await notifRes.json();
    const savedId = saved._id || notifId;

    console.log('✅ Booking + notification saved:', bookingId, savedId);
    return NextResponse.json({ success: true, bookingId, notifId: savedId });

  } catch (error) {
    console.error('Save booking error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

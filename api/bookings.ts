const CRUD_ENDPOINT = process.env.CRUD_ENDPOINT || '4cbef23d6ec041fa9094e952172dd331';
const BASE_URL = `https://crudcrud.com/api/${CRUD_ENDPOINT}`;

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const resp = await fetch(`${BASE_URL}/bookings`, { cache: 'no-store' });
      if (!resp.ok) return res.status(200).json({ bookings: [] });
      const data = await resp.json();

      const bookings = Array.isArray(data) ? data : [];
      const mapped = bookings
        .map((b: any) => ({ ...b, id: b._id || b.bookingId }))
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return res.status(200).json({ bookings: mapped });
    } catch (error) {
      return res.status(200).json({ bookings: [], error: String(error) });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { bookingId, status, notificationId } = req.body;

      // Update booking status
      if (bookingId && status) {
        const resp = await fetch(`${BASE_URL}/bookings`, { cache: 'no-store' });
        const data = await resp.json();
        if (Array.isArray(data)) {
          const booking = data.find((b: any) => b.bookingId === bookingId || b._id === bookingId);
          if (booking) {
            await fetch(`${BASE_URL}/bookings/${booking._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...booking, status }),
            });
          }
        }
      }

      // Update notification action
      if (notificationId) {
        const resp = await fetch(`${BASE_URL}/notifications/${notificationId}`, { cache: 'no-store' });
        if (resp.ok) {
          const n = await resp.json();
          await fetch(`${BASE_URL}/notifications/${notificationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...n, read: true, action: status }),
          });
        }
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, error: String(error) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

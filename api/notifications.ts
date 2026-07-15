const CRUD_ENDPOINT = process.env.CRUD_ENDPOINT || '4cbef23d6ec041fa9094e952172dd331';
const BASE_URL = `https://crudcrud.com/api/${CRUD_ENDPOINT}`;

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const resp = await fetch(`${BASE_URL}/notifications`, { cache: 'no-store' });
      if (!resp.ok) return res.status(200).json({ notifications: [] });
      const data = await resp.json();
      
      const notifications = Array.isArray(data) ? data : [];
      
      const mapped = notifications
        .map((n: any) => ({ ...n, id: n._id || n.notifId }))
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return res.status(200).json({ notifications: mapped });
    } catch (error) {
      console.error('GET notifications error:', error);
      return res.status(200).json({ notifications: [], error: String(error) });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, markAll } = req.body;

      if (markAll) {
        const resp = await fetch(`${BASE_URL}/notifications`, { cache: 'no-store' });
        const data = await resp.json();
        if (Array.isArray(data)) {
          await Promise.all(
            data.map((n: any) =>
              fetch(`${BASE_URL}/notifications/${n._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...n, read: true }),
              })
            )
          );
        }
      } else if (id) {
        const resp = await fetch(`${BASE_URL}/notifications/${id}`, { cache: 'no-store' });
        if (resp.ok) {
          const n = await resp.json();
          await fetch(`${BASE_URL}/notifications/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...n, read: true }),
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

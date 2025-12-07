import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAdmin } from '../_lib/auth';
import { db } from '../_lib/firebase-admin';
import { AuthenticatedRequest } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    if (!requireAdmin(authReq, res)) return;

    try {
      if (req.method === 'GET') {
        // Get users list
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const role = req.query.role as string;

        let query = db.collection('users');

        if (role && (role === 'admin' || role === 'user')) {
          query = query.where('role', '==', role) as any;
        }

        const snapshot = await query.orderBy('createdAt', 'desc').limit(limit).get();

        const users = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));

        return res.status(200).json({ users, page, limit });
      }

      if (req.method === 'PUT') {
        // Update user role
        const { userId, role } = req.body;

        if (!userId || !role || (role !== 'admin' && role !== 'user')) {
          return res.status(400).json({ error: 'Invalid request' });
        }

        await db.collection('users').doc(userId).update({ role });
        return res.status(200).json({ success: true });
      }

      if (req.method === 'DELETE') {
        // Deactivate user
        const { userId } = req.body;

        if (!userId) {
          return res.status(400).json({ error: 'Invalid request' });
        }

        await db.collection('users').doc(userId).update({ isActive: false });
        return res.status(200).json({ success: true });
      }

      return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
      console.error('Users management error:', error);
      res.status(500).json({ error: 'Failed to manage users' });
    }
  });
}

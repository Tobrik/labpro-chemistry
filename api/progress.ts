import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from './_lib/auth';
import { db } from './_lib/firebase-admin';
import { AuthenticatedRequest } from './_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    try {
      const progressDoc = await db
        .collection('users')
        .doc(authReq.user!.uid)
        .collection('progress')
        .doc('stats')
        .get();

      if (!progressDoc.exists) {
        // Return default progress
        res.status(200).json({
          xp: 0,
          level: 1,
          streak: 0,
          tasksCompleted: 0,
        });
        return;
      }

      res.status(200).json(progressDoc.data());
    } catch (error) {
      console.error('Progress fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  });
}

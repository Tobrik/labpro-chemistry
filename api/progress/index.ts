import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from '../_lib/auth';
import { db } from '../_lib/firebase-admin';
import { AuthenticatedRequest, UserProgress } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    try {
      const userId = authReq.user!.uid;
      const doc = await db.collection('userProgress').doc(userId).get();

      if (!doc.exists) {
        // Return default progress
        return res.status(200).json({
          xp: 0,
          level: 1,
          streak: 0,
          lastTrainingDate: null,
          achievements: [],
        });
      }

      res.status(200).json(doc.data() as UserProgress);
    } catch (error) {
      console.error('Get progress error:', error);
      res.status(500).json({ error: 'Failed to get progress' });
    }
  });
}

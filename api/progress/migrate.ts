import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from '../_lib/auth';
import { db, Timestamp } from '../_lib/firebase-admin';
import { AuthenticatedRequest, UserProgress } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    try {
      const userId = authReq.user!.uid;
      const { xp } = req.body;

      if (typeof xp !== 'number') {
        res.status(400).json({ error: 'Invalid XP value' });
        return;
      }

      const progressRef = db.collection('userProgress').doc(userId);
      const existingDoc = await progressRef.get();

      if (existingDoc.exists) {
        const existingData = existingDoc.data() as UserProgress;

        // Only migrate if backend XP is less than localStorage XP
        if (existingData.xp < xp) {
          await progressRef.update({
            xp,
            level: Math.floor(xp / 100) + 1,
            updatedAt: Timestamp.now(),
          });
        }

        res.status(200).json(existingDoc.data());
        return;
      }

      // Create new progress document
      const newProgress: UserProgress = {
        xp,
        level: Math.floor(xp / 100) + 1,
        streak: 0,
        lastTrainingDate: null,
        achievements: [],
        updatedAt: Timestamp.now(),
      };

      await progressRef.set(newProgress);
      res.status(200).json(newProgress);
    } catch (error) {
      console.error('Migrate progress error:', error);
      res.status(500).json({ error: 'Failed to migrate progress' });
    }
  });
}

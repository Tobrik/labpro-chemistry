import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from './_lib/auth';
import { db } from './_lib/firebase-admin';
import { AuthenticatedRequest } from './_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    try {
      const progressRef = db
        .collection('users')
        .doc(authReq.user!.uid)
        .collection('progress')
        .doc('stats');

      // GET - fetch progress
      if (req.method === 'GET') {
        const progressDoc = await progressRef.get();

        if (!progressDoc.exists) {
          res.status(200).json({
            xp: 0,
            level: 1,
            streak: 0,
            tasksCompleted: 0,
          });
          return;
        }

        res.status(200).json(progressDoc.data());
        return;
      }

      // POST - add XP
      if (req.method === 'POST') {
        const { xpToAdd, correct } = req.body;

        if (!xpToAdd || typeof xpToAdd !== 'number') {
          res.status(400).json({ error: 'Invalid xpToAdd' });
          return;
        }

        const progressDoc = await progressRef.get();
        const currentData = progressDoc.exists ? progressDoc.data() : {
          xp: 0,
          level: 1,
          tasksCompleted: 0,
          correctAnswers: 0,
          streak: 0,
          bestStreak: 0
        };

        const newXp = (currentData!.xp || 0) + xpToAdd;
        const newTasksCompleted = (currentData!.tasksCompleted || 0) + 1;
        const correctAnswers = (currentData!.correctAnswers || 0) + (correct ? 1 : 0);

        // Update streak
        let newStreak = currentData!.streak || 0;
        let bestStreak = currentData!.bestStreak || 0;

        if (correct) {
          newStreak += 1;
          if (newStreak > bestStreak) {
            bestStreak = newStreak;
          }
        } else {
          newStreak = 0;
        }

        // Level up every 3 correct answers
        const newLevel = Math.floor(correctAnswers / 3) + 1;

        await progressRef.set({
          xp: newXp,
          level: newLevel,
          tasksCompleted: newTasksCompleted,
          correctAnswers: correctAnswers,
          streak: newStreak,
          bestStreak: bestStreak,
          lastUpdated: new Date().toISOString(),
        });

        res.status(200).json({
          xp: newXp,
          level: newLevel,
          tasksCompleted: newTasksCompleted,
          correctAnswers: correctAnswers,
          streak: newStreak,
          bestStreak: bestStreak,
          xpAdded: xpToAdd,
        });
        return;
      }

      res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
      console.error('Progress error:', error);
      res.status(500).json({ error: 'Failed to handle progress' });
    }
  });
}

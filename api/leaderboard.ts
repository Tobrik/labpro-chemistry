import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_lib/firebase-admin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all users
    const usersSnapshot = await db.collection('users').get();

    const leaderboard = await Promise.all(
      usersSnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const progressDoc = await db
          .collection('users')
          .doc(userDoc.id)
          .collection('progress')
          .doc('stats')
          .get();

        const progressData = progressDoc.exists ? progressDoc.data() : { xp: 0, level: 1, tasksCompleted: 0 };

        return {
          uid: userDoc.id,
          displayName: userData.displayName || userData.email?.split('@')[0] || 'Anonymous',
          email: userData.email,
          xp: progressData!.xp || 0,
          level: progressData!.level || 1,
          tasksCompleted: progressData!.tasksCompleted || 0,
        };
      })
    );

    // Sort by XP descending
    leaderboard.sort((a, b) => b.xp - a.xp);

    // Return top 10
    res.status(200).json(leaderboard.slice(0, 10));
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}

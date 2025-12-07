import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAdmin } from '../_lib/auth';
import { db } from '../_lib/firebase-admin';
import { AuthenticatedRequest } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    if (!requireAdmin(authReq, res)) return;

    try {
      // Get total users
      const usersSnapshot = await db.collection('users').count().get();
      const totalUsers = usersSnapshot.data().count;

      // Get active users (logged in within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activeUsersSnapshot = await db
        .collection('users')
        .where('lastLoginAt', '>=', thirtyDaysAgo)
        .count()
        .get();
      const activeUsers = activeUsersSnapshot.data().count;

      // Get today's activity
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayActivitySnapshot = await db
        .collection('users')
        .where('lastLoginAt', '>=', today)
        .count()
        .get();
      const todayActivity = todayActivitySnapshot.data().count;

      // Get top users by XP
      const topUsersSnapshot = await db
        .collection('userProgress')
        .orderBy('xp', 'desc')
        .limit(5)
        .get();

      const topUsersPromises = topUsersSnapshot.docs.map(async (doc) => {
        const userDoc = await db.collection('users').doc(doc.id).get();
        const userData = userDoc.data();
        const progressData = doc.data();

        return {
          name: userData?.displayName || 'Unknown',
          xp: progressData.xp || 0,
          level: progressData.level || 1,
        };
      });

      const topUsers = await Promise.all(topUsersPromises);

      res.status(200).json({
        totalUsers,
        activeUsers,
        todayActivity,
        totalAIQueries: 0, // Placeholder - would need analytics collection
        topUsers,
        recentErrors: [], // Placeholder - would need error logging
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });
}

import { Response } from 'express';
import { AuthenticatedRequest, DashboardStats } from '../../types';
import { db, Timestamp } from '../../config/firebase';

export const getDashboard = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get total users count
    const usersSnapshot = await db.collection('users').count().get();
    const totalUsers = usersSnapshot.data().count;

    // Get active users (logged in within last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const activeUsersSnapshot = await db
      .collection('users')
      .where('lastLoginAt', '>=', Timestamp.fromDate(weekAgo))
      .count()
      .get();
    const activeUsers = activeUsersSnapshot.data().count;

    // Get today's AI queries count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aiQueriesSnapshot = await db
      .collection('analytics')
      .doc('events')
      .collection('events')
      .where('eventType', '==', 'ai_query')
      .where('timestamp', '>=', Timestamp.fromDate(today))
      .count()
      .get();
    const todayActivity = aiQueriesSnapshot.data().count;

    // Get top users by XP
    const topUsersSnapshot = await db
      .collection('userProgress')
      .orderBy('xp', 'desc')
      .limit(5)
      .get();

    const topUsers = await Promise.all(
      topUsersSnapshot.docs.map(async (doc) => {
        const progress = doc.data();
        const userDoc = await db.collection('users').doc(doc.id).get();
        const userData = userDoc.data();

        return {
          name: userData?.displayName || 'Unknown',
          xp: progress.xp,
          level: progress.level,
        };
      })
    );

    // Get recent errors (placeholder - would need error logging implementation)
    const recentErrors: Array<{ message: string; timestamp: any }> = [];

    const stats: DashboardStats = {
      totalUsers,
      activeUsers,
      todayActivity,
      totalAIQueries: todayActivity,
      topUsers,
      recentErrors,
    };

    return res.json(stats);
  } catch (error) {
    console.error('Error in getDashboard:', error);
    return res.status(500).json({
      error: 'Failed to get dashboard stats',
    });
  }
};

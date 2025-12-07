import { db, Timestamp } from '../config/firebase';
import { UserProgress, UpdateXPRequest, UpdateXPResponse } from '../types';

export class ProgressService {
  /**
   * Get user progress
   */
  async getProgress(userId: string): Promise<UserProgress | null> {
    try {
      const doc = await db.collection('userProgress').doc(userId).get();

      if (!doc.exists) {
        return null;
      }

      return doc.data() as UserProgress;
    } catch (error) {
      console.error('Error getting progress:', error);
      throw new Error('Failed to get progress');
    }
  }

  /**
   * Update user XP and calculate level
   */
  async updateXP(
    userId: string,
    request: UpdateXPRequest
  ): Promise<UpdateXPResponse> {
    try {
      const progressRef = db.collection('userProgress').doc(userId);
      const progressDoc = await progressRef.get();

      const currentProgress = progressDoc.exists
        ? (progressDoc.data() as UserProgress)
        : {
            xp: 0,
            level: 1,
            streak: 0,
            lastTrainingDate: null,
            achievements: [],
            updatedAt: Timestamp.now(),
          };

      const newXp = currentProgress.xp + request.xpGained;
      const newLevel = Math.floor(newXp / 100) + 1;
      const leveledUp = newLevel > currentProgress.level;

      // Update streak logic
      const now = new Date();
      const lastDate = currentProgress.lastTrainingDate?.toDate();
      let newStreak = currentProgress.streak;

      if (lastDate) {
        const daysDiff = Math.floor(
          (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          // Consecutive day
          newStreak += 1;
        } else if (daysDiff > 1) {
          // Streak broken
          newStreak = 1;
        }
        // Same day: keep streak
      } else {
        // First training
        newStreak = 1;
      }

      // Check for new achievements
      const newAchievements: string[] = [];
      if (leveledUp && newLevel === 5 && !currentProgress.achievements.includes('level_5')) {
        newAchievements.push('level_5');
      }
      if (leveledUp && newLevel === 10 && !currentProgress.achievements.includes('level_10')) {
        newAchievements.push('level_10');
      }
      if (newStreak >= 7 && !currentProgress.achievements.includes('streak_7')) {
        newAchievements.push('streak_7');
      }

      const updatedProgress: Partial<UserProgress> = {
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastTrainingDate: Timestamp.now(),
        achievements: [
          ...currentProgress.achievements,
          ...newAchievements,
        ],
        updatedAt: Timestamp.now(),
      };

      await progressRef.set(updatedProgress, { merge: true });

      // Create training session record
      await db
        .collection('trainingStats')
        .doc(userId)
        .collection('sessions')
        .add({
          userId,
          mode: request.mode,
          questionsAnswered: request.totalQuestions,
          correctAnswers: request.correctAnswers,
          wrongAnswers: request.totalQuestions - request.correctAnswers,
          xpEarned: request.xpGained,
          startTime: Timestamp.now(),
          endTime: Timestamp.now(),
          duration: 0,
        });

      return {
        newXp,
        newLevel,
        leveledUp,
        newAchievements: newAchievements.length > 0 ? newAchievements : undefined,
      };
    } catch (error) {
      console.error('Error updating XP:', error);
      throw new Error('Failed to update XP');
    }
  }

  /**
   * Migrate progress from localStorage
   */
  async migrateProgress(userId: string, xp: number): Promise<UserProgress> {
    try {
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

        return existingDoc.data() as UserProgress;
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

      return newProgress;
    } catch (error) {
      console.error('Error migrating progress:', error);
      throw new Error('Failed to migrate progress');
    }
  }

  /**
   * Get training statistics
   */
  async getStats(userId: string, period?: string) {
    try {
      let query = db
        .collection('trainingStats')
        .doc(userId)
        .collection('sessions')
        .orderBy('startTime', 'desc');

      if (period === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.where('startTime', '>=', Timestamp.fromDate(weekAgo));
      } else if (period === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.where('startTime', '>=', Timestamp.fromDate(monthAgo));
      }

      const snapshot = await query.get();
      const sessions = snapshot.docs.map((doc) => doc.data());

      const totalSessions = sessions.length;
      const totalQuestions = sessions.reduce(
        (sum, s: any) => sum + s.questionsAnswered,
        0
      );
      const totalCorrect = sessions.reduce(
        (sum, s: any) => sum + s.correctAnswers,
        0
      );
      const accuracy =
        totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
      const totalXP = sessions.reduce((sum, s: any) => sum + s.xpEarned, 0);

      return {
        totalSessions,
        totalQuestions,
        accuracy: Math.round(accuracy * 100) / 100,
        totalXP,
        sessionsHistory: sessions.slice(0, 20),
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw new Error('Failed to get stats');
    }
  }
}

export const progressService = new ProgressService();

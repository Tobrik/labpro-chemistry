import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import { progressService } from '../../services/progressService';

export const getProgress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const progress = await progressService.getProgress(req.user.uid);

    if (!progress) {
      // Return default progress if user has none
      return res.json({
        xp: 0,
        level: 1,
        streak: 0,
        lastTrainingDate: null,
        achievements: [],
      });
    }

    return res.json(progress);
  } catch (error) {
    console.error('Error in getProgress:', error);
    return res.status(500).json({
      error: 'Failed to get progress',
    });
  }
};

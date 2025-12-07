import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import { progressService } from '../../services/progressService';

export const getStats = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const period = req.query.period as string | undefined;
    const stats = await progressService.getStats(req.user.uid, period);

    return res.json(stats);
  } catch (error) {
    console.error('Error in getStats:', error);
    return res.status(500).json({
      error: 'Failed to get stats',
    });
  }
};

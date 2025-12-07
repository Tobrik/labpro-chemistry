import { Response } from 'express';
import { AuthenticatedRequest, UpdateXPRequest } from '../../types';
import { progressService } from '../../services/progressService';
import { z } from 'zod';

const updateXPSchema = z.object({
  xpGained: z.number().int().min(0).max(1000),
  mode: z.enum(['elements', 'balancing']),
  correctAnswers: z.number().int().min(0),
  totalQuestions: z.number().int().min(0),
});

export const updateXP = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate request body
    const validatedData = updateXPSchema.parse(req.body);
    const request = validatedData as UpdateXPRequest;

    // Update XP
    const result = await progressService.updateXP(req.user.uid, request);

    return res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Error in updateXP:', error);
    return res.status(500).json({
      error: 'Failed to update XP',
    });
  }
};

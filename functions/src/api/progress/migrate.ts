import { Response } from 'express';
import { AuthenticatedRequest, MigrateProgressRequest } from '../../types';
import { progressService } from '../../services/progressService';
import { z } from 'zod';

const migrateSchema = z.object({
  xp: z.number().int().min(0),
});

export const migrateProgress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate request body
    const validatedData = migrateSchema.parse(req.body);
    const { xp } = validatedData as MigrateProgressRequest;

    // Migrate progress
    const migratedData = await progressService.migrateProgress(req.user.uid, xp);

    return res.json({
      success: true,
      migratedData,
      message: 'Progress migrated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Error in migrateProgress:', error);
    return res.status(500).json({
      error: 'Failed to migrate progress',
    });
  }
};

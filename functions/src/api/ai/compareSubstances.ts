import { Response } from 'express';
import { AuthenticatedRequest, CompareSubstancesRequest } from '../../types';
import { llmService } from '../../services/llmService';
import { z } from 'zod';

const compareSubstancesSchema = z.object({
  substanceA: z.string().min(1).max(100),
  substanceB: z.string().min(1).max(100),
  language: z.enum(['ru', 'en', 'kk']).optional().default('ru'),
});

export const compareSubstances = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Validate request body
    const validatedData = compareSubstancesSchema.parse(req.body);
    const { substanceA, substanceB, language } = validatedData;

    const result = await llmService.compareSubstances(substanceA, substanceB, language);

    return res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Error in compareSubstances:', error);
    return res.status(500).json({
      error: 'Failed to compare substances',
    });
  }
};

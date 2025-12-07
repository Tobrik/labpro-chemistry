import { Response } from 'express';
import { AuthenticatedRequest, CompareSubstancesRequest } from '../../types';
import { geminiService } from '../../services/geminiService';
import { z } from 'zod';

const compareSubstancesSchema = z.object({
  substanceA: z.string().min(1).max(100),
  substanceB: z.string().min(1).max(100),
});

export const compareSubstances = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Validate request body
    const validatedData = compareSubstancesSchema.parse(req.body);
    const { substanceA, substanceB } = validatedData as CompareSubstancesRequest;

    // Call Gemini service
    const result = await geminiService.compareSubstances(substanceA, substanceB);

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

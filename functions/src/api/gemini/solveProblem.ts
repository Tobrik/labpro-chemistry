import { Response } from 'express';
import { AuthenticatedRequest, SolveProblemRequest } from '../../types';
import { geminiService } from '../../services/geminiService';
import { z } from 'zod';

const solveProblemSchema = z.object({
  problem: z.string().min(10).max(2000),
});

export const solveProblem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Validate request body
    const validatedData = solveProblemSchema.parse(req.body);
    const { problem } = validatedData as SolveProblemRequest;

    // Call Gemini service
    const result = await geminiService.solveProblem(problem);

    return res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Error in solveProblem:', error);
    return res.status(500).json({
      error: 'Failed to solve problem',
    });
  }
};

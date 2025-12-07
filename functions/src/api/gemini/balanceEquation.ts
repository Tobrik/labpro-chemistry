import { Response } from 'express';
import { AuthenticatedRequest, BalanceEquationRequest } from '../../types';
import { geminiService } from '../../services/geminiService';
import { z } from 'zod';

const balanceEquationSchema = z.object({
  equation: z
    .string()
    .min(3, 'Equation too short')
    .max(500, 'Equation too long')
    .regex(/^[A-Za-z0-9\s+\->()\[\]=→]+$/, 'Invalid characters in equation'),
});

export const balanceEquation = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Validate request body
    const validatedData = balanceEquationSchema.parse(req.body);
    const { equation } = validatedData as BalanceEquationRequest;

    // Call Gemini service
    const result = await geminiService.balanceEquation(equation);

    return res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Error in balanceEquation:', error);
    return res.status(500).json({
      error: 'Failed to balance equation',
    });
  }
};

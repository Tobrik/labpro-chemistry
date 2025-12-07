import { Response } from 'express';
import { AuthenticatedRequest, ElementDetailsRequest } from '../../types';
import { geminiService } from '../../services/geminiService';
import { z } from 'zod';

const elementDetailsSchema = z.object({
  elementName: z.string().min(1).max(50),
});

export const getElementDetails = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Validate request body
    const validatedData = elementDetailsSchema.parse(req.body);
    const { elementName } = validatedData as ElementDetailsRequest;

    // Call Gemini service
    const details = await geminiService.getElementDetails(elementName);

    return res.json(details);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Error in getElementDetails:', error);
    return res.status(500).json({
      error: 'Failed to get element details',
    });
  }
};

import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from '../_lib/auth';
import { compareSubstances } from '../_lib/gemini';
import { AuthenticatedRequest, CompareSubstancesRequest } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    try {
      const { substanceA, substanceB } = req.body as CompareSubstancesRequest;

      if (!substanceA || !substanceB || typeof substanceA !== 'string' || typeof substanceB !== 'string') {
        return res.status(400).json({ error: 'Invalid substances' });
      }

      const result = await compareSubstances(substanceA, substanceB);
      res.status(200).json(result);
    } catch (error) {
      console.error('Compare substances error:', error);
      res.status(500).json({ error: 'Failed to compare substances' });
    }
  });
}

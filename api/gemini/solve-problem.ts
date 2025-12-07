import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from '../_lib/auth';
import { solveProblem } from '../_lib/gemini';
import { AuthenticatedRequest, SolveProblemRequest } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    try {
      const { problem } = req.body as SolveProblemRequest;

      if (!problem || typeof problem !== 'string') {
        return res.status(400).json({ error: 'Invalid problem' });
      }

      const result = await solveProblem(problem);
      res.status(200).json(result);
    } catch (error) {
      console.error('Solve problem error:', error);
      res.status(500).json({ error: 'Failed to solve problem' });
    }
  });
}

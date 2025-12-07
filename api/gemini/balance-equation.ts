import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from '../_lib/auth';
import { balanceEquation } from '../_lib/gemini';
import { AuthenticatedRequest, BalanceEquationRequest } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    try {
      const { equation } = req.body as BalanceEquationRequest;

      if (!equation || typeof equation !== 'string') {
        res.status(400).json({ error: 'Invalid equation' });
        return;
      }

      const result = await balanceEquation(equation);
      res.status(200).json(result);
    } catch (error) {
      console.error('Balance equation error:', error);
      res.status(500).json({ error: 'Failed to balance equation' });
    }
  });
}

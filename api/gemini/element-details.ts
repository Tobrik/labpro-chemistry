import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from '../_lib/auth';
import { getElementDetails } from '../_lib/gemini';
import { AuthenticatedRequest, ElementDetailsRequest } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    try {
      const { elementName } = req.body as ElementDetailsRequest;

      if (!elementName || typeof elementName !== 'string') {
        res.status(400).json({ error: 'Invalid element name' });
        return;
      }

      const result = await getElementDetails(elementName);
      res.status(200).json(result);
    } catch (error) {
      console.error('Element details error:', error);
      res.status(500).json({ error: 'Failed to get element details' });
    }
  });
}

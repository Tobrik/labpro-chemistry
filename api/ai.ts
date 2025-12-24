import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from './_lib/auth';
import {
  balanceEquation,
  getElementDetails,
  compareSubstances,
  solveProblem,
  translateElement
} from './_lib/gemini';
import { AuthenticatedRequest } from './_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    try {
      const { action, ...params } = req.body;

      let result;
      switch (action) {
        case 'element-details':
          if (!params.elementName || typeof params.elementName !== 'string') {
            res.status(400).json({ error: 'Invalid element name' });
            return;
          }
          const language = params.language || 'ru';
          result = await translateElement(params.elementName, language);
          break;

        case 'balance-equation':
          if (!params.equation || typeof params.equation !== 'string') {
            res.status(400).json({ error: 'Invalid equation' });
            return;
          }
          const balanceLanguage = params.language || 'ru';
          result = await balanceEquation(params.equation, balanceLanguage);
          break;

        case 'compare-substances':
          if (!params.substanceA || !params.substanceB) {
            res.status(400).json({ error: 'Invalid substances' });
            return;
          }
          const compareLanguage = params.language || 'ru';
          result = await compareSubstances(params.substanceA, params.substanceB, compareLanguage);
          break;

        case 'solve-problem':
          if (!params.problem || typeof params.problem !== 'string') {
            res.status(400).json({ error: 'Invalid problem' });
            return;
          }
          result = await solveProblem(params.problem);
          break;

        case 'translate-element':
          if (!params.element || !params.targetLang) {
            res.status(400).json({ error: 'Invalid parameters' });
            return;
          }
          result = await translateElement(params.element, params.targetLang);
          break;

        default:
          res.status(400).json({ error: 'Invalid action' });
          return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('AI request error:', error);
      res.status(500).json({ error: 'AI request failed' });
    }
  });
}

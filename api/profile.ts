import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from './_lib/auth';
import { AuthenticatedRequest } from './_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    const user = authReq.user!;
    res.status(200).json({
      uid: user.uid,
      email: user.email,
      role: user.role || 'user',
    });
  });
}

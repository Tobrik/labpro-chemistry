import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from '../_lib/auth';
import { db, Timestamp } from '../_lib/firebase-admin';
import { AuthenticatedRequest } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authReq = req as AuthenticatedRequest;

  await authenticate(authReq, res, async () => {
    try {
      const userId = authReq.user!.uid;

      if (req.method === 'GET') {
        // Get user profile
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
          return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(userDoc.data());
      }

      if (req.method === 'PUT') {
        // Update user profile
        const { displayName, profilePhotoUrl } = req.body;

        const updates: any = {
          lastLoginAt: Timestamp.now(),
        };

        if (displayName) updates.displayName = displayName;
        if (profilePhotoUrl) updates.profilePhotoUrl = profilePhotoUrl;

        await db.collection('users').doc(userId).update(updates);

        const updatedDoc = await db.collection('users').doc(userId).get();
        return res.status(200).json(updatedDoc.data());
      }

      return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ error: 'Failed to manage profile' });
    }
  });
}

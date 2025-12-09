import { VercelRequest, VercelResponse } from '@vercel/node';
import { auth, db } from './firebase-admin';
import { AuthenticatedRequest } from './types';

export async function authenticate(
  req: AuthenticatedRequest,
  res: VercelResponse,
  next: () => void | Promise<void>
): Promise<void> {
  try {
    const authHeader = req.headers.authorization as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      // Verify Firebase ID token
      const decodedToken = await auth.verifyIdToken(token);

      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();

      // Auto-create user document if it doesn't exist
      if (!userDoc.exists) {
        console.log('Auto-creating user document for', decodedToken.uid);
        const admin = await import('firebase-admin');
        const newUserData = {
          uid: decodedToken.uid,
          email: decodedToken.email || '',
          displayName: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
          role: 'user',
          isActive: true,
          createdAt: admin.firestore.Timestamp.now(),
          lastLoginAt: admin.firestore.Timestamp.now(),
        };

        await db.collection('users').doc(decodedToken.uid).set(newUserData);

        // Initialize progress
        await db
          .collection('users')
          .doc(decodedToken.uid)
          .collection('progress')
          .doc('stats')
          .set({
            xp: 0,
            level: 1,
            tasksCompleted: 0,
            correctAnswers: 0,
            streak: 0,
            bestStreak: 0,
            createdAt: admin.firestore.Timestamp.now(),
          });

        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email || '',
          role: 'user',
        };
      } else {
        const userData = userDoc.data();

        if (!userData?.isActive) {
          res.status(403).json({ error: 'User account is deactivated' });
          return;
        }

        // Attach user info to request
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email || '',
          role: userData.role || 'user',
        };
      }

      await next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: VercelResponse): boolean {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized: Authentication required' });
    return false;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
    return false;
  }

  return true;
}

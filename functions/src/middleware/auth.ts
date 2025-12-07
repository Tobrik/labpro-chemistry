import { Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../config/firebase';
import { AuthenticatedRequest } from '../types';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      // Verify Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Get user data from Firestore
      const userDoc = await db
        .collection('users')
        .doc(decodedToken.uid)
        .get();

      if (!userDoc.exists) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

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

      next();
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
};

import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import { db } from '../../config/firebase';

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();

    return res.json({
      uid: req.user.uid,
      email: userData?.email,
      displayName: userData?.displayName,
      role: userData?.role || 'user',
      createdAt: userData?.createdAt,
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    return res.status(500).json({
      error: 'Failed to get profile',
    });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { displayName, profilePhotoUrl } = req.body;

    const updates: any = {};
    if (displayName) updates.displayName = displayName;
    if (profilePhotoUrl) updates.profilePhotoUrl = profilePhotoUrl;

    await db.collection('users').doc(req.user.uid).update(updates);

    const updatedDoc = await db.collection('users').doc(req.user.uid).get();

    return res.json({
      success: true,
      user: { uid: req.user.uid, ...updatedDoc.data() },
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({
      error: 'Failed to update profile',
    });
  }
};

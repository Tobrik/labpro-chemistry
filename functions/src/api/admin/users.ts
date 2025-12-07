import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import { db } from '../../config/firebase';

export const getUsers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const role = req.query.role as string;

    let query = db.collection('users');

    if (role && (role === 'admin' || role === 'user')) {
      query = query.where('role', '==', role) as any;
    }

    const snapshot = await query.orderBy('createdAt', 'desc').limit(limit).get();

    const users = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));

    // Get total count
    const countSnapshot = role
      ? await db.collection('users').where('role', '==', role).count().get()
      : await db.collection('users').count().get();

    const total = countSnapshot.data().count;
    const pages = Math.ceil(total / limit);

    return res.json({
      users,
      total,
      page,
      pages,
    });
  } catch (error) {
    console.error('Error in getUsers:', error);
    return res.status(500).json({
      error: 'Failed to get users',
    });
  }
};

export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.params;
    const { role } = req.body;

    if (!role || (role !== 'admin' && role !== 'user')) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await db.collection('users').doc(userId).update({ role });

    const updatedDoc = await db.collection('users').doc(userId).get();

    return res.json({
      success: true,
      user: { uid: userId, ...updatedDoc.data() },
    });
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return res.status(500).json({
      error: 'Failed to update user role',
    });
  }
};

export const deactivateUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.params;

    await db.collection('users').doc(userId).update({ isActive: false });

    return res.json({
      success: true,
      message: 'User deactivated',
    });
  } catch (error) {
    console.error('Error in deactivateUser:', error);
    return res.status(500).json({
      error: 'Failed to deactivate user',
    });
  }
};

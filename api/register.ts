import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_lib/firebase-admin';
import admin from 'firebase-admin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Check if user document already exists
    const userDoc = await db.collection('users').doc(uid).get();

    if (userDoc.exists) {
      return res.status(200).json({ message: 'User already exists', user: userDoc.data() });
    }

    // Create new user document
    const { email, displayName } = req.body;

    const userData = {
      uid,
      email: email || decodedToken.email,
      displayName: displayName || decodedToken.name || email?.split('@')[0] || 'User',
      role: 'user',
      isActive: true,
      createdAt: admin.firestore.Timestamp.now(),
      lastLoginAt: admin.firestore.Timestamp.now(),
    };

    await db.collection('users').doc(uid).set(userData);

    // Initialize progress
    await db
      .collection('users')
      .doc(uid)
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

    return res.status(201).json({ message: 'User created successfully', user: userData });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}

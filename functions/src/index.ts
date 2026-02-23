import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Middleware
import { authenticate } from './middleware/auth';
import { requireAdmin } from './middleware/adminOnly';
import {
  aiRateLimit,
  progressRateLimit,
  adminRateLimit,
  authRateLimit,
} from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';

// API endpoints
import { getElementDetails } from './api/ai/elementDetails';
import { balanceEquation } from './api/ai/balanceEquation';
import { compareSubstances } from './api/ai/compareSubstances';
import { solveProblem } from './api/ai/solveProblem';

import { getProgress } from './api/progress/getProgress';
import { updateXP } from './api/progress/updateXP';
import { migrateProgress } from './api/progress/migrate';
import { getStats } from './api/progress/getStats';

import { getProfile, updateProfile } from './api/auth/profile';

import { getDashboard } from './api/admin/dashboard';
import { getUsers, updateUserRole, deactivateUser } from './api/admin/users';

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://labpro-chemistry.web.app',
  'https://labpro-chemistry.firebaseapp.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Security headers
app.use(helmet());

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== AUTH ENDPOINTS =====
app.get('/api/auth/profile', authRateLimit, authenticate, getProfile);
app.put('/api/auth/profile', authRateLimit, authenticate, updateProfile);

// ===== AI ENDPOINTS =====
app.post(
  '/api/ai/element-details',
  aiRateLimit,
  authenticate,
  getElementDetails
);
app.post(
  '/api/ai/balance-equation',
  aiRateLimit,
  authenticate,
  balanceEquation
);
app.post(
  '/api/ai/compare-substances',
  aiRateLimit,
  authenticate,
  compareSubstances
);
app.post(
  '/api/ai/solve-problem',
  aiRateLimit,
  authenticate,
  solveProblem
);

// ===== PROGRESS ENDPOINTS =====
app.get('/api/progress', progressRateLimit, authenticate, getProgress);
app.post('/api/progress/xp', progressRateLimit, authenticate, updateXP);
app.get('/api/progress/stats', progressRateLimit, authenticate, getStats);
app.post('/api/progress/migrate', progressRateLimit, authenticate, migrateProgress);

// ===== ADMIN ENDPOINTS =====
app.get(
  '/api/admin/dashboard',
  adminRateLimit,
  authenticate,
  requireAdmin,
  getDashboard
);
app.get(
  '/api/admin/users',
  adminRateLimit,
  authenticate,
  requireAdmin,
  getUsers
);
app.put(
  '/api/admin/users/:userId/role',
  adminRateLimit,
  authenticate,
  requireAdmin,
  updateUserRole
);
app.delete(
  '/api/admin/users/:userId',
  adminRateLimit,
  authenticate,
  requireAdmin,
  deactivateUser
);

// Error handler (must be last)
app.use(errorHandler);

// Export the Express app as a Cloud Function
export const api = functions.https.onRequest(app);

// Cloud Function to create user profile on signup
export const createUserProfile = functions.auth.user().onCreate(async (user) => {
  const { db } = await import('./config/firebase');

  try {
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      role: 'user',
      createdAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true,
    });

    console.log(`User profile created for ${user.uid}`);
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
});

// Note: Last login timestamp is updated via the auth profile endpoint
// when users log in from the frontend

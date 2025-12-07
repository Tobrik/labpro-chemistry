// Shared TypeScript types for API
import { VercelRequest } from '@vercel/node';

export interface AuthenticatedRequest extends VercelRequest {
  user?: {
    uid: string;
    email: string;
    role: 'admin' | 'user';
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  createdAt: FirebaseFirestore.Timestamp;
  lastLoginAt?: FirebaseFirestore.Timestamp;
  isActive: boolean;
  profilePhotoUrl?: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastTrainingDate: FirebaseFirestore.Timestamp | null;
  achievements: string[];
  updatedAt: FirebaseFirestore.Timestamp;
}

// Gemini API types
export interface BalanceEquationRequest {
  equation: string;
}

export interface CompareSubstancesRequest {
  substanceA: string;
  substanceB: string;
}

export interface ElementDetailsRequest {
  elementName: string;
}

export interface SolveProblemRequest {
  problem: string;
}

// Progress API types
export interface UpdateXPRequest {
  xpGained: number;
  mode: 'elements' | 'balancing';
  correctAnswers: number;
  totalQuestions: number;
}

export interface UpdateXPResponse {
  newXp: number;
  newLevel: number;
  leveledUp: boolean;
  newAchievements?: string[];
}

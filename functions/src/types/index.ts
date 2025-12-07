// Shared TypeScript types for Cloud Functions
import { Request } from 'express';

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

export interface TrainingSession {
  sessionId: string;
  userId: string;
  mode: 'elements' | 'balancing';
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  xpEarned: number;
  startTime: FirebaseFirestore.Timestamp;
  endTime: FirebaseFirestore.Timestamp;
  duration: number;
}

export interface AnalyticsEvent {
  eventId: string;
  userId: string;
  eventType: 'page_view' | 'feature_use' | 'ai_query' | 'error' | 'training_completed';
  feature?: string;
  metadata?: Record<string, any>;
  timestamp: FirebaseFirestore.Timestamp;
  sessionId?: string;
  userAgent?: string;
}

export interface AnalyticsAggregated {
  date: string;
  totalUsers: number;
  activeUsers: number;
  aiQueriesCount: number;
  featureUsage: Record<string, number>;
  topFeatures: string[];
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface Formula {
  id: string;
  name: string;
  nameRu: string;
  equation: string;
  category: string;
  description?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role: 'admin' | 'user';
  };
}

// Gemini API request/response types
export interface BalanceEquationRequest {
  equation: string;
}

export interface BalanceEquationResponse {
  balancedEquation: string;
  explanation: string;
}

export interface CompareSubstancesRequest {
  substanceA: string;
  substanceB: string;
}

export interface CompareSubstancesResponse {
  text: string;
  sources?: Array<{ title: string; uri: string }>;
}

export interface ElementDetailsRequest {
  elementName: string;
}

export interface ElementDetailsResponse {
  electronConfiguration: string;
  electronShells: string;
  oxidationStates: string;
  meltingPoint: string;
  boilingPoint: string;
  density: string;
  discoveryYear: string;
  description: string;
}

export interface SolveProblemRequest {
  problem: string;
}

export interface SolveProblemResponse {
  solution: string;
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

export interface MigrateProgressRequest {
  xp: number;
}

// Admin API types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  todayActivity: number;
  totalAIQueries: number;
  topUsers: Array<{ name: string; xp: number; level: number }>;
  recentErrors: Array<{ message: string; timestamp: FirebaseFirestore.Timestamp }>;
}

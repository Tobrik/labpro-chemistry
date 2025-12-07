import rateLimit from 'express-rate-limit';
import { Request } from 'express';
import { AuthenticatedRequest } from '../types';

const getUserIdentifier = (req: Request): string => {
  const authReq = req as AuthenticatedRequest;
  return authReq.user?.uid || req.ip || 'anonymous';
};

export const createRateLimiter = (config: {
  windowMs: number;
  maxRequests: number;
  message?: string;
}) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.maxRequests,
    message: config.message || 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getUserIdentifier,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(config.windowMs / 1000),
      });
    },
  });
};

// Rate limiter configurations for different endpoint categories
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
  message: 'Too many authentication requests. Please try again later.',
});

export const geminiRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20,
  message: 'AI request limit exceeded. Please wait before trying again.',
});

export const progressRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60,
});

export const analyticsRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
});

export const adminRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
});

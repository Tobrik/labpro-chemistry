import { GoogleGenerativeAI } from '@google/generative-ai';
import * as functions from 'firebase-functions';

// Get API key from Firebase Functions config or environment variable
const apiKey = functions.config().gemini?.api_key || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Gemini API key not configured. Set with: firebase functions:config:set gemini.api_key="YOUR_KEY"');
}

export const geminiClient = new GoogleGenerativeAI(apiKey || '');

// Model configurations
export const MODELS = {
  FLASH: 'gemini-2.5-flash',
  PRO: 'gemini-3-pro-preview',
};

export function getFlashModel() {
  return geminiClient.getGenerativeModel({
    model: MODELS.FLASH,
  });
}

export function getProModel() {
  return geminiClient.getGenerativeModel({
    model: MODELS.PRO,
    generationConfig: {
      temperature: 0.7,
    },
  });
}

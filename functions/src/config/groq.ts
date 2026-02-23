import * as functions from 'firebase-functions';

const apiKey = functions.config().groq?.api_key || process.env.GROQ_API_KEY;

if (!apiKey) {
  console.error('Groq API key not configured. Set with: firebase functions:config:set groq.api_key="YOUR_KEY"');
}

export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const GROQ_API_KEY = apiKey || '';
export const MODEL = 'llama-3.3-70b-versatile';

import { BalancerResult, ComparisonResult, DetailedElementData, SolverResult } from "../types";
import { auth } from "../src/config/firebase";

const API_BASE = '/api';

const authenticatedFetch = async (url: string, body: any): Promise<any> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to use AI features');
  }

  const token = await user.getIdToken();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // Response is not JSON (e.g. 404 HTML page)
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const balanceEquationAI = async (equation: string, language: 'ru' | 'en' | 'kk' = 'ru'): Promise<BalancerResult> => {
  try {
    return await authenticatedFetch(`${API_BASE}/ai`, { action: 'balance-equation', equation, language });
  } catch (error) {
    console.error("Balancing error:", error);
    throw new Error("Failed to balance equation using AI.");
  }
};

export const compareSubstancesAI = async (substanceA: string, substanceB: string, language: 'ru' | 'en' | 'kk' = 'ru'): Promise<ComparisonResult> => {
  try {
    return await authenticatedFetch(`${API_BASE}/ai`, { action: 'compare-substances', substanceA, substanceB, language });
  } catch (error) {
    console.error("Comparison error:", error);
    throw new Error("Failed to compare substances.");
  }
};

export const getElementDetailsAI = async (elementName: string, language: 'ru' | 'en' | 'kk' = 'ru'): Promise<DetailedElementData> => {
  try {
    console.log('[AIService] Fetching element details:', { elementName, language });
    return await authenticatedFetch(`${API_BASE}/ai`, { action: 'element-details', elementName, language });
  } catch (error) {
    console.error("Element Details error:", error);
    throw new Error("Failed to fetch element details.");
  }
};

export const solveProblemAI = async (problem: string, language: 'ru' | 'en' | 'kk' = 'ru'): Promise<SolverResult> => {
  try {
    return await authenticatedFetch(`${API_BASE}/ai`, { action: 'solve-problem', problem, language });
  } catch (error) {
    console.error("Solver error:", error);
    throw new Error("Failed to solve problem.");
  }
};

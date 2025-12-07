import { getFlashModel, getProModel } from '../config/gemini';
import {
  BalanceEquationResponse,
  CompareSubstancesResponse,
  ElementDetailsResponse,
  SolveProblemResponse,
} from '../types';

export class GeminiService {
  /**
   * Get detailed element information using Gemini Flash model
   */
  async getElementDetails(elementName: string): Promise<ElementDetailsResponse> {
    try {
      const model = getFlashModel();

      const prompt = `Предоставь подробную информацию об элементе "${elementName}" в формате JSON со следующими полями:
{
  "electronConfiguration": "электронная конфигурация",
  "electronShells": "распределение электронов по оболочкам",
  "oxidationStates": "степени окисления",
  "meltingPoint": "температура плавления",
  "boilingPoint": "температура кипения",
  "density": "плотность",
  "discoveryYear": "год открытия",
  "description": "краткое описание (2-3 предложения)"
}

Ответ должен быть строго в формате JSON, без дополнительного текста.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const data = JSON.parse(jsonMatch[0]);
      return data as ElementDetailsResponse;
    } catch (error) {
      console.error('Error getting element details:', error);
      throw new Error('Failed to get element details');
    }
  }

  /**
   * Balance chemical equation using Gemini Pro model with thinking
   */
  async balanceEquation(equation: string): Promise<BalanceEquationResponse> {
    try {
      const model = getProModel();

      const prompt = `Уравняй химическое уравнение: ${equation}

Предоставь ответ в формате JSON:
{
  "balancedEquation": "уравненное уравнение с коэффициентами",
  "explanation": "краткое объяснение процесса уравнивания"
}

Используй стрелку → вместо =. Ответ должен быть строго в формате JSON.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const data = JSON.parse(jsonMatch[0]);
      return data as BalanceEquationResponse;
    } catch (error) {
      console.error('Error balancing equation:', error);
      throw new Error('Failed to balance equation');
    }
  }

  /**
   * Compare two substances using Gemini Flash with search grounding
   */
  async compareSubstances(
    substanceA: string,
    substanceB: string
  ): Promise<CompareSubstancesResponse> {
    try {
      const model = getFlashModel();

      const prompt = `Сравни два вещества: ${substanceA} и ${substanceB}.

Предоставь подробное сравнение, включая:
- Химические свойства
- Физические свойства
- Применение
- Различия и сходства

Ответ должен быть развернутым, на русском языке.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extract sources if available (note: actual implementation may vary based on Gemini API features)
      const sources: Array<{ title: string; uri: string }> = [];

      return {
        text,
        sources: sources.length > 0 ? sources : undefined,
      };
    } catch (error) {
      console.error('Error comparing substances:', error);
      throw new Error('Failed to compare substances');
    }
  }

  /**
   * Solve chemistry problem using Gemini Pro model
   */
  async solveProblem(problem: string): Promise<SolveProblemResponse> {
    try {
      const model = getProModel();

      const prompt = `Реши следующую химическую задачу: ${problem}

Предоставь решение в формате Markdown со следующими разделами:
## Дано:
[что дано в задаче]

## Найти:
[что нужно найти]

## Решение:
[пошаговое решение с объяснениями]

## Ответ:
[финальный ответ]

Будь подробным и понятным.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return {
        solution: text,
      };
    } catch (error) {
      console.error('Error solving problem:', error);
      throw new Error('Failed to solve problem');
    }
  }
}

export const geminiService = new GeminiService();

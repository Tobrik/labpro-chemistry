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
  async getElementDetails(elementName: string, language: 'ru' | 'en' | 'kk' = 'ru'): Promise<ElementDetailsResponse> {
    try {
      const model = getFlashModel();

      const prompts = {
        ru: `Предоставь подробную информацию об элементе "${elementName}" в формате JSON со следующими полями:
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

Ответ должен быть строго в формате JSON, без дополнительного текста.`,
        en: `Provide detailed information about the element "${elementName}" in JSON format with the following fields:
{
  "electronConfiguration": "electron configuration",
  "electronShells": "electron shell distribution",
  "oxidationStates": "oxidation states",
  "meltingPoint": "melting point",
  "boilingPoint": "boiling point",
  "density": "density",
  "discoveryYear": "discovery year",
  "description": "brief description (2-3 sentences)"
}

The response must be strictly in JSON format, without additional text.`,
        kk: `"${elementName}" элементі туралы JSON форматында мынадай өрістермен толық ақпарат беріңіз:
{
  "electronConfiguration": "электрондық конфигурация",
  "electronShells": "электрондық қабықтар бойынша таралуы",
  "oxidationStates": "тотығу дәрежелері",
  "meltingPoint": "балқу температурасы",
  "boilingPoint": "қайнау температурасы",
  "density": "тығыздық",
  "discoveryYear": "ашылған жыл",
  "description": "қысқаша сипаттама (2-3 сөйлем)"
}

Жауап қосымша мәтінсіз тек JSON форматында болуы керек.`
      };

      const prompt = prompts[language];
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
  async balanceEquation(equation: string, language: 'ru' | 'en' | 'kk' = 'ru'): Promise<BalanceEquationResponse> {
    try {
      const model = getProModel();

      const prompts = {
        ru: `Уравняй химическое уравнение: ${equation}

Предоставь ответ в формате JSON:
{
  "balancedEquation": "уравненное уравнение с коэффициентами",
  "explanation": "краткое объяснение процесса уравнивания"
}

Используй стрелку → вместо =. Ответ должен быть строго в формате JSON.`,
        en: `Balance the chemical equation: ${equation}

Provide the answer in JSON format:
{
  "balancedEquation": "balanced equation with coefficients",
  "explanation": "brief explanation of the balancing process"
}

Use the arrow → instead of =. The answer must be strictly in JSON format.`,
        kk: `Химиялық теңдеуді теңестіріңіз: ${equation}

Жауапты JSON форматында беріңіз:
{
  "balancedEquation": "коэффициенттері бар теңестірілген теңдеу",
  "explanation": "теңестіру процесінің қысқаша түсініктемесі"
}

= орнына → бағдаршасын қолданыңыз. Жауап тек JSON форматында болуы керек.`
      };

      const prompt = prompts[language];
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
    substanceB: string,
    language: 'ru' | 'en' | 'kk' = 'ru'
  ): Promise<CompareSubstancesResponse> {
    try {
      const model = getFlashModel();

      const prompts = {
        ru: `Сравни два вещества: ${substanceA} и ${substanceB}.

Предоставь подробное сравнение, включая:
- Химические свойства
- Физические свойства
- Применение
- Различия и сходства

Ответ должен быть развернутым, на русском языке.`,
        en: `Compare two substances: ${substanceA} and ${substanceB}.

Provide a detailed comparison, including:
- Chemical properties
- Physical properties
- Applications
- Differences and similarities

The answer should be comprehensive in English.`,
        kk: `Екі затты салыстырыңыз: ${substanceA} және ${substanceB}.

Мынаны қамтитын толық салыстыру беріңіз:
- Химиялық қасиеттер
- Физикалық қасиеттер
- Қолдану
- Айырмашылықтар мен ұқсастықтар

Жауап қазақ тілінде толық болуы керек.`
      };

      const prompt = prompts[language];
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

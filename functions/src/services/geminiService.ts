import { getFlashModel, getProModel, geminiClient, MODELS } from '../config/gemini';
import {
  BalanceEquationResponse,
  CompareSubstancesResponse,
  ElementDetailsResponse,
  SolveProblemResponse,
} from '../types';

export class GeminiService {
  /**
   * Get detailed element information using Gemini Flash model with language-specific systemInstruction
   */
  async getElementDetails(elementName: string, language: 'ru' | 'en' | 'kk' = 'ru'): Promise<ElementDetailsResponse> {
    try {
      const systemInstructions = {
        ru: 'Ты русскоязычный химический справочник. Отвечай ТОЛЬКО на русском языке. ВСЕ текстовые поля ДОЛЖНЫ быть на русском. Это ОБЯЗАТЕЛЬНОЕ требование.',
        en: 'You are a chemistry reference. Respond ONLY in English. ALL text fields MUST be in English.',
        kk: 'Сен қазақ тілді химиялық анықтамалықсың. ТЕК ҚАЗАҚ тілінде жауап бер. БАРЛЫҚ мәтіндік өрістер ҚАЗАҚША болуы КЕРЕК. Бұл МІНДЕТТІ талап.'
      };

      const model = geminiClient.getGenerativeModel({
        model: MODELS.FLASH,
        systemInstruction: systemInstructions[language]
      });

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
      const systemInstructions = {
        ru: 'Ты химический помощник. Отвечай ТОЛЬКО на русском языке. Все объяснения должны быть на русском.',
        en: 'You are a chemistry assistant. Respond ONLY in English. All explanations must be in English.',
        kk: 'Сен химия көмекшісісің. Тек қазақ тілінде жауап бер. Барлық түсіндірмелер қазақша болуы керек.'
      };

      const model = geminiClient.getGenerativeModel({
        model: MODELS.PRO,
        systemInstruction: systemInstructions[language],
        generationConfig: {
          temperature: 0.7,
        },
      });

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
      const systemInstructions = {
        ru: 'Ты химический эксперт. Отвечай ТОЛЬКО на русском языке. Весь текст должен быть на русском.',
        en: 'You are a chemistry expert. Respond ONLY in English. All text must be in English.',
        kk: 'Сен химия сарапшысысың. Тек қазақ тілінде жауап бер. Барлық мәтін қазақша болуы керек.'
      };

      const model = geminiClient.getGenerativeModel({
        model: MODELS.FLASH,
        systemInstruction: systemInstructions[language]
      });

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
  async solveProblem(problem: string, language: 'ru' | 'en' | 'kk' = 'ru'): Promise<SolveProblemResponse> {
    try {
      const systemInstructions = {
        ru: 'Ты химический репетитор. Отвечай ТОЛЬКО на русском языке. Все решения и объяснения должны быть на русском.',
        en: 'You are a chemistry tutor. Respond ONLY in English. All solutions and explanations must be in English.',
        kk: 'Сен химия репетиторысың. Тек қазақ тілінде жауап бер. Барлық шешімдер мен түсіндірмелер қазақша болуы керек.'
      };

      const model = geminiClient.getGenerativeModel({
        model: MODELS.PRO,
        systemInstruction: systemInstructions[language],
        generationConfig: {
          temperature: 0.7,
        },
      });

      const prompts = {
        ru: `Реши следующую химическую задачу: ${problem}

Предоставь решение в формате Markdown со следующими разделами:
## Дано:
[что дано в задаче]

## Найти:
[что нужно найти]

## Решение:
[пошаговое решение с объяснениями]

## Ответ:
[финальный ответ]

Будь подробным и понятным. Отвечай на русском языке.`,
        en: `Solve the following chemistry problem: ${problem}

Provide the solution in Markdown format with the following sections:
## Given:
[what is given in the problem]

## Find:
[what needs to be found]

## Solution:
[step-by-step solution with explanations]

## Answer:
[final answer]

Be detailed and clear. Answer in English.`,
        kk: `Келесі химиялық есепті шешіңіз: ${problem}

Шешімді Markdown форматында келесі бөлімдермен беріңіз:
## Берілген:
[есепте не берілген]

## Табу керек:
[нені табу керек]

## Шешім:
[түсіндірмелермен қадамдық шешім]

## Жауап:
[соңғы жауап]

Толық және түсінікті болыңыз. Қазақ тілінде жауап беріңіз.`
      };

      const prompt = prompts[language];
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

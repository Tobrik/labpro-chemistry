import { GROQ_API_URL, GROQ_API_KEY, MODEL } from '../config/groq';
import {
  BalanceEquationResponse,
  CompareSubstancesResponse,
  ElementDetailsResponse,
  SolveProblemResponse,
} from '../types';

type Language = 'ru' | 'en' | 'kk';

async function callGroq(
  systemMessage: string,
  userMessage: string,
  jsonMode: boolean = false
): Promise<string> {
  const body: Record<string, unknown> = {
    model: MODEL,
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.7,
    max_tokens: 2048,
  };

  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Groq] API error:', response.status, errorText);
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export class LLMService {
  async getElementDetails(elementName: string, language: Language = 'ru'): Promise<ElementDetailsResponse> {
    const systemInstructions: Record<Language, string> = {
      ru: 'Ты русскоязычный химический справочник. Отвечай ТОЛЬКО на русском языке. ВСЕ текстовые поля ДОЛЖНЫ быть на русском. Это ОБЯЗАТЕЛЬНОЕ требование.',
      en: 'You are a chemistry reference. Respond ONLY in English. ALL text fields MUST be in English.',
      kk: 'Сен қазақ тілді химиялық анықтамалықсың. ТЕК ҚАЗАҚ тілінде жауап бер. БАРЛЫҚ мәтіндік өрістер ҚАЗАҚША болуы КЕРЕК. Бұл МІНДЕТТІ талап.'
    };

    const prompts: Record<Language, string> = {
      ru: `Предоставь подробную информацию об элементе "${elementName}" в формате JSON:
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
IMPORTANT: Your ENTIRE response MUST be in Russian.`,
      en: `Provide detailed information about the element "${elementName}" in JSON format:
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
IMPORTANT: Your ENTIRE response MUST be in English.`,
      kk: `"${elementName}" элементі туралы JSON форматында толық ақпарат беріңіз:
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
IMPORTANT: Your ENTIRE response MUST be in Kazakh.`
    };

    try {
      const text = await callGroq(systemInstructions[language], prompts[language], true);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid response format from AI');
      return JSON.parse(jsonMatch[0]) as ElementDetailsResponse;
    } catch (error) {
      console.error('Error getting element details:', error);
      throw new Error('Failed to get element details');
    }
  }

  async balanceEquation(equation: string, language: Language = 'ru'): Promise<BalanceEquationResponse> {
    const systemInstructions: Record<Language, string> = {
      ru: 'Ты химический помощник. Отвечай ТОЛЬКО на русском языке. Все объяснения должны быть на русском.',
      en: 'You are a chemistry assistant. Respond ONLY in English. All explanations must be in English.',
      kk: 'Сен химия көмекшісісің. Тек қазақ тілінде жауап бер. Барлық түсіндірмелер қазақша болуы керек.'
    };

    const langMap: Record<Language, string> = { ru: 'Russian', en: 'English', kk: 'Kazakh' };

    const prompt = `Balance the chemical equation: ${equation}

Provide the answer in JSON format:
{
  "balancedEquation": "balanced equation with coefficients using → arrow",
  "explanation": "brief explanation of the balancing process"
}

IMPORTANT: Your ENTIRE response MUST be in ${langMap[language]}.`;

    try {
      const text = await callGroq(systemInstructions[language], prompt, true);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid response format from AI');
      return JSON.parse(jsonMatch[0]) as BalanceEquationResponse;
    } catch (error) {
      console.error('Error balancing equation:', error);
      throw new Error('Failed to balance equation');
    }
  }

  async compareSubstances(substanceA: string, substanceB: string, language: Language = 'ru'): Promise<CompareSubstancesResponse> {
    const systemInstructions: Record<Language, string> = {
      ru: 'Ты химический эксперт. Отвечай ТОЛЬКО на русском языке. Весь текст должен быть на русском.',
      en: 'You are a chemistry expert. Respond ONLY in English. All text must be in English.',
      kk: 'Сен химия сарапшысысың. Тек қазақ тілінде жауап бер. Барлық мәтін қазақша болуы керек.'
    };

    const langMap: Record<Language, string> = { ru: 'Russian', en: 'English', kk: 'Kazakh' };

    const prompt = `Compare two substances: ${substanceA} and ${substanceB}.

Provide a detailed comparison including:
- Chemical properties
- Physical properties
- Applications
- Differences and similarities

IMPORTANT: Your ENTIRE response MUST be in ${langMap[language]}.`;

    try {
      const text = await callGroq(systemInstructions[language], prompt);
      return { text };
    } catch (error) {
      console.error('Error comparing substances:', error);
      throw new Error('Failed to compare substances');
    }
  }

  async solveProblem(problem: string, language: Language = 'ru'): Promise<SolveProblemResponse> {
    const systemInstructions: Record<Language, string> = {
      ru: 'Ты химический репетитор. Отвечай ТОЛЬКО на русском языке. Все решения и объяснения должны быть на русском.',
      en: 'You are a chemistry tutor. Respond ONLY in English. All solutions and explanations must be in English.',
      kk: 'Сен химия репетиторысың. Тек қазақ тілінде жауап бер. Барлық шешімдер мен түсіндірмелер қазақша болуы керек.'
    };

    const langMap: Record<Language, string> = { ru: 'Russian', en: 'English', kk: 'Kazakh' };

    const prompt = `Solve this chemistry problem step by step: ${problem}

Provide the solution in Markdown with sections: Given, Find, Solution, Answer.

IMPORTANT: Your ENTIRE response MUST be in ${langMap[language]}.`;

    try {
      const solution = await callGroq(systemInstructions[language], prompt);
      return { solution };
    } catch (error) {
      console.error('Error solving problem:', error);
      throw new Error('Failed to solve problem');
    }
  }
}

export const llmService = new LLMService();

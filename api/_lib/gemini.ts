import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function balanceEquation(equation: string, language: 'ru' | 'en' | 'kk' = 'ru') {
  const systemInstructions = {
    ru: 'Ты химический помощник. Отвечай ТОЛЬКО на русском языке. Все объяснения должны быть на русском.',
    en: 'You are a chemistry assistant. Respond ONLY in English. All explanations must be in English.',
    kk: 'Сен химия көмекшісісің. Тек қазақ тілінде жауап бер. Барлық түсіндірмелер қазақша болуы керек.'
  };

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemInstructions[language]
  });

  const langMap = {
    ru: 'Russian',
    en: 'English',
    kk: 'Kazakh'
  };

  const prompt = `Balance this chemical equation: ${equation}

Return ONLY a JSON object with this exact structure:
{
  "balancedEquation": "the balanced equation",
  "explanation": "brief explanation of how it was balanced IN ${langMap[language]}"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse response');
  }

  return JSON.parse(jsonMatch[0]);
}

export async function getElementDetails(elementName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Provide detailed information about the chemical element: ${elementName}

Return ONLY a JSON object with this exact structure:
{
  "electronConfiguration": "electron configuration",
  "electronShells": "electron shell distribution",
  "oxidationStates": "common oxidation states",
  "meltingPoint": "melting point with units",
  "boilingPoint": "boiling point with units",
  "density": "density with units",
  "discoveryYear": "year of discovery",
  "description": "brief description"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse response');
  }

  return JSON.parse(jsonMatch[0]);
}

export async function compareSubstances(substanceA: string, substanceB: string, language: 'ru' | 'en' | 'kk' = 'ru') {
  const systemInstructions = {
    ru: 'Ты химический эксперт. Отвечай ТОЛЬКО на русском языке. Весь текст должен быть на русском.',
    en: 'You are a chemistry expert. Respond ONLY in English. All text must be in English.',
    kk: 'Сен химия сарапшысысың. Тек қазақ тілінде жауап бер. Барлық мәтін қазақша болуы керек.'
  };

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemInstructions[language]
  });

  const langMap = {
    ru: 'Russian',
    en: 'English',
    kk: 'Kazakh'
  };

  const prompt = `Compare these two chemical substances: ${substanceA} and ${substanceB}

Provide a detailed comparison including:
- Chemical formulas
- Physical properties
- Chemical properties
- Common uses
- Key differences

Format the response in clear, readable text IN ${langMap[language]}.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return { text, sources: [] };
}

export async function solveProblem(problem: string, language: 'ru' | 'en' | 'kk' = 'ru') {
  const systemInstructions = {
    ru: 'Ты химический репетитор. Отвечай ТОЛЬКО на русском языке. Все решения и объяснения должны быть на русском.',
    en: 'You are a chemistry tutor. Respond ONLY in English. All solutions and explanations must be in English.',
    kk: 'Сен химия репетиторысың. Тек қазақ тілінде жауап бер. Барлық шешімдер мен түсіндірмелер қазақша болуы керек.'
  };

  const langMap = {
    ru: 'Russian',
    en: 'English',
    kk: 'Kazakh'
  };

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemInstructions[language]
  });

  const prompt = `Solve this chemistry problem step by step: ${problem}

Provide IN ${langMap[language]}:
1. Problem analysis
2. Step-by-step solution
3. Final answer
4. Brief explanation

Format the response in clear, readable text with proper formatting.`;

  const result = await model.generateContent(prompt);
  const solution = result.response.text();

  return { solution };
}

export async function translateElement(elementName: string, targetLang: 'ru' | 'en' | 'kk') {
  const systemInstructions = {
    ru: 'Ты русскоязычный химический справочник. Отвечай ТОЛЬКО на русском языке. ВСЕ текстовые поля ДОЛЖНЫ быть на русском. Это ОБЯЗАТЕЛЬНОЕ требование.',
    en: 'You are a chemistry reference. Respond ONLY in English. ALL text fields MUST be in English.',
    kk: 'Сен қазақ тілді химиялық анықтамалықсың. ТЕК ҚАЗАҚ тілінде жауап бер. БАРЛЫҚ мәтіндік өрістер ҚАЗАҚША болуы КЕРЕК. Бұл МІНДЕТТІ талап.'
  };

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemInstructions[targetLang]
  });

  const prompts = {
    ru: `Предоставь информацию о химическом элементе "${elementName}" НА РУССКОМ ЯЗЫКЕ.

Верни ТОЛЬКО JSON объект (без markdown, без \`\`\`):
{
  "electronConfiguration": "электронная конфигурация (например: [He] 2s² 2p²)",
  "electronShells": "числа через запятую (например: 2, 4)",
  "oxidationStates": "степени окисления (например: -4, +2, +4)",
  "meltingPoint": "температура плавления (например: 3550 °C)",
  "boilingPoint": "температура кипения (например: 4827 °C)",
  "density": "плотность (например: 2,26 г/см³)",
  "discoveryYear": "год открытия (например: Древность или 1774)",
  "description": "2-3 предложения об этом элементе НА РУССКОМ ЯЗЫКЕ"
}`,
    en: `Provide information about the chemical element "${elementName}" in English.

Return ONLY a JSON object (no markdown, no \`\`\`):
{
  "electronConfiguration": "electron configuration",
  "electronShells": "numbers separated by comma",
  "oxidationStates": "oxidation states",
  "meltingPoint": "melting point with units",
  "boilingPoint": "boiling point with units",
  "density": "density with units",
  "discoveryYear": "year of discovery",
  "description": "2-3 sentences about this element in English"
}`,
    kk: `"${elementName}" химиялық элементі туралы ақпаратты ҚАЗАҚ ТІЛІНДЕ бер.

ТЕК JSON объектін қайтар (markdown жоқ, \`\`\` жоқ):
{
  "electronConfiguration": "электрондық конфигурация (мысалы: [He] 2s² 2p²)",
  "electronShells": "үтірмен бөлінген сандар (мысалы: 2, 4)",
  "oxidationStates": "тотығу дәрежелері (мысалы: -4, +2, +4)",
  "meltingPoint": "балқу температурасы (мысалы: 3550 °C)",
  "boilingPoint": "қайнау температурасы (мысалы: 4827 °C)",
  "density": "тығыздығы (мысалы: 2,26 г/см³)",
  "discoveryYear": "ашылған жылы (мысалы: Ежелгі заман немесе 1774)",
  "description": "Осы элемент туралы 2-3 сөйлем ҚАЗАҚ ТІЛІНДЕ жаз"
}`
  };

  const result = await model.generateContent(prompts[targetLang]);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse response');
  }

  return JSON.parse(jsonMatch[0]);
}

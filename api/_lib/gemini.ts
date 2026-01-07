import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function balanceEquation(equation: string, language: 'ru' | 'en' | 'kk' = 'ru') {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const langMap = {
    ru: 'Russian',
    en: 'English',
    kk: 'Kazakh'
  };

  const prompt = `Balance this chemical equation: ${equation}

IMPORTANT: Respond in ${langMap[language]} language.

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
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
  });

  const langMap = {
    ru: 'Russian',
    en: 'English',
    kk: 'Kazakh'
  };

  const prompt = `Compare these two chemical substances: ${substanceA} and ${substanceB}

IMPORTANT: Respond ENTIRELY in ${langMap[language]} language.

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

export async function solveProblem(problem: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Solve this chemistry problem step by step: ${problem}

Provide:
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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
  "oxidationStates": "common oxidation states",
  "meltingPoint": "melting point with units",
  "boilingPoint": "boiling point with units",
  "density": "density with units",
  "discoveryYear": "year of discovery",
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

  const prompt = prompts[targetLang];
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse response');
  }

  return JSON.parse(jsonMatch[0]);
}

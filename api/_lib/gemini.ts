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
  const langConfig = {
    ru: {
      systemInstruction: 'Ты химический справочник. Отвечай ТОЛЬКО на русском языке. Все ответы должны быть на русском.',
      prompt: `Предоставь информацию о химическом элементе "${elementName}".

Верни JSON объект со следующими полями (ВСЕ значения на РУССКОМ языке):
{
  "electronConfiguration": "[He] 2s² 2p² (пример формата)",
  "electronShells": "2, 4 (числа через запятую)",
  "oxidationStates": "-4, +2, +4 (пример)",
  "meltingPoint": "3550 °C (сублимируется)",
  "boilingPoint": "4827 °C",
  "density": "2,26 г/см³",
  "discoveryYear": "Древность",
  "description": "Напиши 2-3 предложения об этом элементе НА РУССКОМ ЯЗЫКЕ. Опиши его свойства и применение."
}

КРИТИЧЕСКИ ВАЖНО: Поле "description" ДОЛЖНО быть написано на РУССКОМ языке!`
    },
    en: {
      systemInstruction: 'You are a chemistry reference. Respond only in English.',
      prompt: `Provide information about the chemical element "${elementName}".

Return a JSON object with the following fields:
{
  "electronConfiguration": "electron configuration",
  "electronShells": "shell distribution as numbers",
  "oxidationStates": "common oxidation states",
  "meltingPoint": "melting point with units",
  "boilingPoint": "boiling point with units",
  "density": "density with units",
  "discoveryYear": "year of discovery",
  "description": "brief description (2-3 sentences)"
}

Return ONLY valid JSON.`
    },
    kk: {
      systemInstruction: 'Сен химиялық анықтамалықсың. Тек қазақ тілінде жауап бер. Барлық жауаптар қазақша болуы керек.',
      prompt: `"${elementName}" химиялық элементі туралы ақпарат бер.

Мына өрістері бар JSON объектін қайтар (БАРЛЫҚ мәндер ҚАЗАҚ тілінде):
{
  "electronConfiguration": "[He] 2s² 2p² (формат мысалы)",
  "electronShells": "2, 4 (үтірмен бөлінген сандар)",
  "oxidationStates": "-4, +2, +4 (мысал)",
  "meltingPoint": "3550 °C (сублимацияланады)",
  "boilingPoint": "4827 °C",
  "density": "2,26 г/см³",
  "discoveryYear": "Ежелгі заман",
  "description": "Осы элемент туралы 2-3 сөйлем ҚАЗАҚ ТІЛІНДЕ жаз. Оның қасиеттері мен қолданылуын сипатта."
}

ӨТЕ МАҢЫЗДЫ: "description" өрісі ҚАЗАҚ тілінде жазылуы КЕРЕК!`
    }
  };

  const config = langConfig[targetLang];
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: config.systemInstruction
  });

  const result = await model.generateContent(config.prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse response');
  }

  return JSON.parse(jsonMatch[0]);
}

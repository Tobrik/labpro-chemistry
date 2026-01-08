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
  // Use gemini-1.5-flash which better supports language instructions
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const prompts = {
    ru: `Ты — русскоязычный химический справочник. Твоя задача — предоставить информацию о химическом элементе "${elementName}" СТРОГО НА РУССКОМ ЯЗЫКЕ.

ВНИМАНИЕ: ВСЕ текстовые поля в ответе ДОЛЖНЫ быть на РУССКОМ языке. Это обязательное требование.

Верни ТОЛЬКО JSON объект (без markdown, без \`\`\`):
{
  "electronConfiguration": "электронная конфигурация (например: [He] 2s² 2p²)",
  "electronShells": "числа через запятую (например: 2, 4)",
  "oxidationStates": "степени окисления (например: -4, +2, +4)",
  "meltingPoint": "температура на русском (например: 3550 °C или Сублимируется при 3642 °C)",
  "boilingPoint": "температура на русском (например: 4827 °C)",
  "density": "плотность на русском (например: 2,26 г/см³)",
  "discoveryYear": "год или период на русском (например: Древность или 1774)",
  "description": "ОБЯЗАТЕЛЬНО НА РУССКОМ: Напиши 2-3 предложения об этом элементе. Опиши что это за элемент, его основные свойства и где применяется. ПИШИ ТОЛЬКО ПО-РУССКИ!"
}`,
    en: `You are a chemistry reference. Provide information about the chemical element "${elementName}" in English.

Return ONLY a JSON object (no markdown, no \`\`\`):
{
  "electronConfiguration": "electron configuration",
  "electronShells": "numbers separated by comma",
  "oxidationStates": "oxidation states",
  "meltingPoint": "melting point with units",
  "boilingPoint": "boiling point with units",
  "density": "density with units",
  "discoveryYear": "year of discovery",
  "description": "2-3 sentences about this element"
}`,
    kk: `Сен — қазақ тілді химиялық анықтамалықсың. "${elementName}" химиялық элементі туралы ақпаратты ТЕК ҚАЗАҚ ТІЛІНДЕ бер.

НАЗАР АУДАР: Жауаптағы БАРЛЫҚ мәтіндік өрістер ҚАЗАҚ тілінде болуы КЕРЕК. Бұл міндетті талап.

ТЕК JSON объектін қайтар (markdown жоқ, \`\`\` жоқ):
{
  "electronConfiguration": "электрондық конфигурация (мысалы: [He] 2s² 2p²)",
  "electronShells": "үтірмен бөлінген сандар (мысалы: 2, 4)",
  "oxidationStates": "тотығу дәрежелері (мысалы: -4, +2, +4)",
  "meltingPoint": "температура қазақша (мысалы: 3550 °C немесе 3642 °C-де сублимацияланады)",
  "boilingPoint": "температура қазақша (мысалы: 4827 °C)",
  "density": "тығыздық қазақша (мысалы: 2,26 г/см³)",
  "discoveryYear": "жыл немесе кезең қазақша (мысалы: Ежелгі заман немесе 1774)",
  "description": "МІНДЕТТІ ТҮРДЕ ҚАЗАҚША: Осы элемент туралы 2-3 сөйлем жаз. Бұл қандай элемент, оның негізгі қасиеттері мен қолданылуын сипатта. ТЕК ҚАЗАҚША ЖАЗ!"
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

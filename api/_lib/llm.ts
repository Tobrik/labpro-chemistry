const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

function getApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }
  return key;
}

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
      'Authorization': `Bearer ${getApiKey()}`,
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

export async function balanceEquation(equation: string, language: Language = 'ru') {
  const systemInstructions: Record<Language, string> = {
    ru: 'Ты химический помощник. Отвечай ТОЛЬКО на русском языке. Все объяснения должны быть на русском.',
    en: 'You are a chemistry assistant. Respond ONLY in English. All explanations must be in English.',
    kk: 'Сен химия көмекшісісің. Тек қазақ тілінде жауап бер. Барлық түсіндірмелер қазақша болуы керек.'
  };

  const langMap: Record<Language, string> = { ru: 'Russian', en: 'English', kk: 'Kazakh' };

  const prompt = `Balance this chemical equation: ${equation}

Return ONLY a JSON object with this exact structure:
{
  "balancedEquation": "the balanced equation",
  "explanation": "brief explanation of how it was balanced IN ${langMap[language]}"
}

IMPORTANT: Your ENTIRE response MUST be in ${langMap[language]}. Do NOT use any other language.`;

  try {
    console.log(`[BalanceEquation] Model: ${MODEL}, Language: ${language}`);
    const text = await callGroq(systemInstructions[language], prompt, true);
    console.log(`[BalanceEquation] Raw response: ${text?.substring(0, 100)}...`);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[BalanceEquation] Failed to extract JSON from response:', text);
      throw new Error('Failed to parse response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('[BalanceEquation] Error:', error);
    throw error;
  }
}

export async function getElementDetails(elementName: string, targetLang: Language = 'ru') {
  const systemInstructions: Record<Language, string> = {
    ru: 'Ты русскоязычный химический справочник. Отвечай ТОЛЬКО на русском языке. ВСЕ текстовые поля ДОЛЖНЫ быть на русском. Это ОБЯЗАТЕЛЬНОЕ требование.',
    en: 'You are a chemistry reference. Respond ONLY in English. ALL text fields MUST be in English.',
    kk: 'Сен қазақ тілді химиялық анықтамалықсың. ТЕК ҚАЗАҚ тілінде жауап бер. БАРЛЫҚ мәтіндік өрістер ҚАЗАҚША болуы КЕРЕК. Бұл МІНДЕТТІ талап.'
  };

  const prompts: Record<Language, string> = {
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
}

IMPORTANT: Your ENTIRE response MUST be in Russian. Do NOT use any other language.`,
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
}

IMPORTANT: Your ENTIRE response MUST be in English. Do NOT use any other language.`,
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
}

IMPORTANT: Your ENTIRE response MUST be in Kazakh. Do NOT use any other language.`
  };

  try {
    console.log(`[GetElementDetails] Model: ${MODEL}, Element: ${elementName}, TargetLang: ${targetLang}`);
    const text = await callGroq(systemInstructions[targetLang], prompts[targetLang], true);
    console.log(`[GetElementDetails] Raw response: ${text?.substring(0, 100)}...`);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[GetElementDetails] Failed to extract JSON from response:', text);
      throw new Error('Failed to parse response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('[GetElementDetails] Error:', error);
    throw error;
  }
}

export async function compareSubstances(substanceA: string, substanceB: string, language: Language = 'ru') {
  const systemInstructions: Record<Language, string> = {
    ru: 'Ты химический эксперт. Отвечай ТОЛЬКО на русском языке. Весь текст должен быть на русском.',
    en: 'You are a chemistry expert. Respond ONLY in English. All text must be in English.',
    kk: 'Сен химия сарапшысысың. Тек қазақ тілінде жауап бер. Барлық мәтін қазақша болуы керек.'
  };

  const langMap: Record<Language, string> = { ru: 'Russian', en: 'English', kk: 'Kazakh' };

  const prompt = `Compare these two chemical substances: ${substanceA} and ${substanceB}

Provide a detailed comparison including:
- Chemical formulas
- Physical properties
- Chemical properties
- Common uses
- Key differences

Format the response in clear, readable text IN ${langMap[language]}.

IMPORTANT: Your ENTIRE response MUST be in ${langMap[language]}. Do NOT use any other language.`;

  try {
    console.log(`[CompareSubstances] Model: ${MODEL}, Substances: ${substanceA} vs ${substanceB}, Language: ${language}`);
    const text = await callGroq(systemInstructions[language], prompt);
    console.log(`[CompareSubstances] Raw response: ${text?.substring(0, 100)}...`);

    return { text, sources: [] };
  } catch (error) {
    console.error('[CompareSubstances] Error:', error);
    throw error;
  }
}

export async function solveProblem(problem: string, language: Language = 'ru') {
  const systemInstructions: Record<Language, string> = {
    ru: 'Ты химический репетитор. Отвечай ТОЛЬКО на русском языке. Все решения и объяснения должны быть на русском.',
    en: 'You are a chemistry tutor. Respond ONLY in English. All solutions and explanations must be in English.',
    kk: 'Сен химия репетиторысың. Тек қазақ тілінде жауап бер. Барлық шешімдер мен түсіндірмелер қазақша болуы керек.'
  };

  const langMap: Record<Language, string> = { ru: 'Russian', en: 'English', kk: 'Kazakh' };

  const prompt = `Solve this chemistry problem step by step: ${problem}

Provide IN ${langMap[language]}:
1. Problem analysis
2. Step-by-step solution
3. Final answer
4. Brief explanation

Format the response in clear, readable text with proper formatting.

IMPORTANT: Your ENTIRE response MUST be in ${langMap[language]}. Do NOT use any other language.`;

  try {
    console.log(`[SolveProblem] Model: ${MODEL}, Problem length: ${problem.length}, Language: ${language}`);
    const solution = await callGroq(systemInstructions[language], prompt);
    console.log(`[SolveProblem] Raw response: ${solution?.substring(0, 100)}...`);

    return { solution };
  } catch (error) {
    console.error('[SolveProblem] Error:', error);
    throw error;
  }
}

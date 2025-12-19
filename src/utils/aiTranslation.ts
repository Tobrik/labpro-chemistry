import { auth } from '../config/firebase';

const TRANSLATION_CACHE: Record<string, any> = {};

export const translateElementWithAI = async (
  elementName: string,
  targetLang: 'ru' | 'en' | 'kk'
) => {
  const cacheKey = `${elementName}-${targetLang}`;
  if (TRANSLATION_CACHE[cacheKey]) return TRANSLATION_CACHE[cacheKey];

  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  const token = await user.getIdToken();
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      action: 'translate-element',
      element: elementName,
      targetLang
    }),
  });

  if (!response.ok) throw new Error('Translation failed');
  const data = await response.json();
  TRANSLATION_CACHE[cacheKey] = data;
  return data;
};

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  currentLanguage: 'ru' | 'en' | 'kk';
  changeLanguage: (lang: 'ru' | 'en' | 'kk') => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<'ru' | 'en' | 'kk'>('ru');

  useEffect(() => {
    const saved = localStorage.getItem('preferredLanguage') as 'ru' | 'en' | 'kk';
    if (saved) {
      i18n.changeLanguage(saved);
      setCurrentLanguage(saved);
    }
  }, [i18n]);

  const changeLanguage = (lang: 'ru' | 'en' | 'kk') => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

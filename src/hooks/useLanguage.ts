import { useState, useEffect } from 'react';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = async (langCode: string) => {
    setIsTranslating(true);
    try {
      setCurrentLanguage(langCode);
      localStorage.setItem('maritime-calculator-language', langCode);
    } finally {
      setIsTranslating(false);
    }
  };

  const translateElement = async (text: string): Promise<string> => {
    // Basitleştirilmiş - şimdilik orijinal metni döndür
    return text;
  };

  // Load saved language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('maritime-calculator-language');
    if (savedLang && savedLang !== 'tr') {
      setCurrentLanguage(savedLang);
    }
  }, []);

  return {
    currentLanguage,
    setLanguage,
    isTranslating,
    translateElement
  };
};

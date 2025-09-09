import { useState, useEffect } from 'react';

interface AutoLanguageDetectionHook {
  detectedLanguage: string;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  translateContent: (text: string, targetLang?: string) => Promise<string>;
  isTranslating: boolean;
  supportedLanguages: string[];
}

export const useAutoLanguageDetection = (): AutoLanguageDetectionHook => {
  const [detectedLanguage, setDetectedLanguage] = useState<string>('tr');
  const [currentLanguage, setCurrentLanguage] = useState<string>('tr');
  const [isTranslating, setIsTranslating] = useState(false);

  // Desteklenen diller - Global maritime pazarı için
  const supportedLanguages = [
    'tr', 'en', 'es', 'de', 'fr', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi',
    'nl', 'sv', 'no', 'da', 'fi', 'pl', 'cs', 'hu', 'ro', 'el', 'bg', 'hr', 'uk'
  ];

  // Tarayıcı dilini algıla
  useEffect(() => {
    const detectBrowserLanguage = () => {
      const browserLang = navigator.language.toLowerCase();
      const langCode = browserLang.split('-')[0];
      
      if (supportedLanguages.includes(langCode)) {
        setDetectedLanguage(langCode);
        setCurrentLanguage(langCode);
        localStorage.setItem('maritime-calculator-language', langCode);
      } else {
        setDetectedLanguage('tr');
        setCurrentLanguage('tr');
        localStorage.setItem('maritime-calculator-language', 'tr');
      }
    };

    const savedLanguage = localStorage.getItem('maritime-calculator-language');
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      setDetectedLanguage(savedLanguage);
    } else {
      detectBrowserLanguage();
    }
  }, []);

  // Basitleştirilmiş dil değiştirme
  const setLanguage = async (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      setCurrentLanguage(lang);
      localStorage.setItem('maritime-calculator-language', lang);
    }
  };

  // Basitleştirilmiş çeviri (API olmadan)
  const translateContent = async (text: string, targetLang?: string): Promise<string> => {
    const target = targetLang || currentLanguage;
    if (target === 'tr' || !text.trim()) return text;

    try {
      setIsTranslating(true);
      // Basit çeviri mantığı - gerçek API yerine
      return text; // Şimdilik orijinal metni döndür
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    detectedLanguage,
    currentLanguage,
    setLanguage,
    translateContent,
    isTranslating,
    supportedLanguages
  };
};
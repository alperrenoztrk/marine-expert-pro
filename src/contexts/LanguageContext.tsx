import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SupportedLanguage {
  language: string;
  name: string;
  displayName: string;
}

interface LanguageContextType {
  currentLanguage: string;
  supportedLanguages: SupportedLanguage[];
  isLoading: boolean;
  isTranslating: boolean;
  changeLanguage: (languageCode: string) => Promise<void>;
  translateText: (text: string, targetLanguage?: string) => Promise<string>;
  translateBatch: (texts: string[], targetLanguage?: string) => Promise<string[]>;
  autoDetectLanguage: () => Promise<void>;
  getLanguageName: (code: string) => string;
  isRTL: boolean;
  resetLanguagePreferences: () => void;
  applyTranslations: (languageCode?: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Curated Top-25 most spoken languages (ISO codes)
const TOP_25_LANGUAGE_CODES = [
  'en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'ru', 'pt', 'ur',
  'id', 'de', 'ja', 'sw', 'mr', 'te', 'tr', 'ta', 'vi', 'ko',
  'it', 'fa', 'pl', 'uk', 'nl'
];

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [supportedLanguages, setSupportedLanguages] = useState<SupportedLanguage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  // RTL languages
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  const isRTL = rtlLanguages.includes(currentLanguage);

  useEffect(() => {
    initializeLanguage();
    
    // Simplified language detection without external service
    const handleLanguageChange = () => {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang !== currentLanguage) {
        console.log(`Browser language changed to: ${browserLang}`);
        changeLanguage(browserLang);
      }
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, [currentLanguage]);

  const initializeLanguage = async () => {
    setIsLoading(true);
    try {
      const supportedLangs: SupportedLanguage[] = [
        { language: 'en', name: 'English', displayName: 'English' },
        { language: 'tr', name: 'Turkish', displayName: 'Türkçe' },
        { language: 'es', name: 'Spanish', displayName: 'Español' },
        { language: 'fr', name: 'French', displayName: 'Français' },
        { language: 'de', name: 'German', displayName: 'Deutsch' }
      ];
      setSupportedLanguages(supportedLangs);

      const savedLanguage = localStorage.getItem('preferredLanguage') || 'tr';
      setCurrentLanguage(savedLanguage);

      document.documentElement.dir = 'ltr';
      document.documentElement.lang = savedLanguage;
    } catch (error) {
      console.error('Language initialization error:', error);
      setCurrentLanguage('tr');
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (languageCode: string) => {
    if (languageCode === currentLanguage) return;

    setIsTranslating(true);
    try {
      setCurrentLanguage(languageCode);
      localStorage.setItem('preferredLanguage', languageCode);

      document.documentElement.dir = rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
      document.documentElement.lang = languageCode;

      const langName = getLanguageName(languageCode);
      toast({
        title: "Dil Değiştirildi",
        description: `Uygulama dili ${langName} olarak değiştirildi`,
      });
    } catch (error) {
      console.error('Language change error:', error);
      toast({
        title: "Dil Değiştirme Hatası",
        description: "Dil değiştirilirken hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const translateText = async (text: string, targetLanguage?: string): Promise<string> => {
    // Simplified - no API calls, just return original text
    return text;
  };

  const translateBatch = async (texts: string[], targetLanguage?: string): Promise<string[]> => {
    // Simplified - no API calls, just return original texts
    return texts;
  };

  const autoDetectLanguage = async () => {
    try {
      const browserLang = navigator.language.split('-')[0];
      const detectedLang = supportedLanguages.find(lang => lang.language === browserLang)?.language || 'tr';
      
      if (detectedLang !== currentLanguage) {
        await changeLanguage(detectedLang);
        toast({
          title: "Sistem Dili Algılandı",
          description: `Dil ${getLanguageName(detectedLang)} olarak güncellendi`,
        });
      }
    } catch (error) {
      console.error('Auto-detect error:', error);
    }
  };

  const getLanguageName = (code: string): string => {
    return supportedLanguages.find(lang => lang.language === code)?.displayName || code;
  };

  // Simplified - no actual translation, just language switching
  const applyTranslationsToCurrentPage = async (languageCode: string) => {
    // Just update the document language attribute
    document.documentElement.lang = languageCode;
    console.log(`Language switched to: ${languageCode}`);
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    supportedLanguages,
    isLoading,
    isTranslating,
    changeLanguage,
    translateText,
    translateBatch,
    autoDetectLanguage,
    getLanguageName,
    isRTL,
    resetLanguagePreferences: () => {
      localStorage.removeItem('preferredLanguage');
      const browserLang = navigator.language.split('-')[0];
      const detectedLang = supportedLanguages.find(lang => lang.language === browserLang)?.language || 'tr';
      localStorage.setItem('preferredLanguage', detectedLang);
      setCurrentLanguage(detectedLang);
      document.documentElement.dir = rtlLanguages.includes(detectedLang) ? 'rtl' : 'ltr';
      document.documentElement.lang = detectedLang;
    },
    applyTranslations: async (languageCode?: string) => applyTranslationsToCurrentPage(languageCode || (localStorage.getItem('preferredLanguage') || currentLanguage))
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation Hook for components
export const useTranslation = (key: string, defaultText: string = '') => {
  const { translateText, currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState(defaultText);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translateWithCache = async () => {
      if (!defaultText.trim()) return;
      
      setIsLoading(true);
      try {
        // Check cache first
        const cacheKey = `translation_${key}_${currentLanguage}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          setTranslatedText(cached);
        } else {
          const translated = await translateText(defaultText);
          setTranslatedText(translated);
          localStorage.setItem(cacheKey, translated);
        }
      } catch (error) {
        console.error(`Translation error for key ${key}:`, error);
        setTranslatedText(defaultText);
      } finally {
        setIsLoading(false);
      }
    };

    translateWithCache();
  }, [key, defaultText, currentLanguage, translateText]);

  return { text: translatedText, isLoading };
};
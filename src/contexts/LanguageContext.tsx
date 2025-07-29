import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translationService, TranslationResponse, SupportedLanguage } from '@/services/translationAPI';
import { useToast } from '@/hooks/use-toast';

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
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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
  }, []);

  const initializeLanguage = async () => {
    setIsLoading(true);
    try {
      // Load supported languages
      const languages = await translationService.getSupportedLanguages();
      setSupportedLanguages(languages);

      // Check for saved language preference first (manual selection takes priority)
      const savedLanguage = localStorage.getItem('preferredLanguage');
      const isManualSelection = localStorage.getItem('manualLanguageSelection') === 'true';
      
      if (savedLanguage && isManualSelection) {
        // User has manually selected a language before
        setCurrentLanguage(savedLanguage);
        console.log(`Using manually selected language: ${savedLanguage}`);
      } else if (savedLanguage) {
        // Previously saved language (could be from auto-detection)
        setCurrentLanguage(savedLanguage);
      } else {
        // First time user - auto-detect browser language
        const browserLang = translationService.getBrowserLanguage();
        setCurrentLanguage(browserLang);
        localStorage.setItem('preferredLanguage', browserLang);

        // Show notification only for first-time auto-detection
        toast({
          title: "Dil Algılandı",
          description: `Tarayıcı diliniz (${translationService.getLanguageName(browserLang)}) otomatik olarak seçildi. Dil seçici ile değiştirebilirsiniz.`,
        });
      }

      // Update document properties
      const finalLang = localStorage.getItem('preferredLanguage') || 'en';
      document.documentElement.dir = rtlLanguages.includes(finalLang) ? 'rtl' : 'ltr';
      document.documentElement.lang = finalLang;
      
    } catch (error) {
      console.error('Language initialization error:', error);
      toast({
        title: "Dil Hatası",
        description: "Dil ayarları yüklenirken hata oluştu",
        variant: "destructive",
      });
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
      localStorage.setItem('manualLanguageSelection', 'true'); // Mark as manually selected

      // Update document direction for RTL languages
      document.documentElement.dir = rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
      document.documentElement.lang = languageCode;

      toast({
        title: "Dil Değiştirildi",
        description: `Uygulama dili ${translationService.getLanguageName(languageCode)} olarak değiştirildi`,
      });

      // Apply translations without page reload for better UX
      await applyTranslationsToCurrentPage(languageCode);
      
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
    try {
      const target = targetLanguage || currentLanguage;
      if (!text.trim()) return text;

      const result = await translationService.autoDetectAndTranslate(text, target);
      return result.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  };

  const translateBatch = async (texts: string[], targetLanguage?: string): Promise<string[]> => {
    try {
      const target = targetLanguage || currentLanguage;
      const results = await translationService.translateBatch(texts, target);
      return results.map(result => result.translatedText);
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts; // Return original texts on error
    }
  };

  const autoDetectLanguage = async () => {
    try {
      // Sample text to detect language from page content
      const sampleText = document.title || "Maritime Calculator";
      const detection = await translationService.detectLanguage(sampleText);
      
      if (detection.confidence > 0.7 && detection.language !== currentLanguage) {
        const shouldChange = window.confirm(
          `Detected language: ${translationService.getLanguageName(detection.language)}. Switch to this language?`
        );
        
        if (shouldChange) {
          await changeLanguage(detection.language);
        }
      }
    } catch (error) {
      console.error('Auto language detection error:', error);
    }
  };

  const getLanguageName = (code: string): string => {
    return translationService.getLanguageName(code);
  };

  // Apply translations to current page without reload
  const applyTranslationsToCurrentPage = async (languageCode: string) => {
    try {
      // Find all elements with data-translatable attribute
      const translatableElements = document.querySelectorAll('[data-translatable]');
      
      if (translatableElements.length === 0) return;

      const textsToTranslate = Array.from(translatableElements).map(el => el.textContent || '');
      
      // Filter out empty texts
      const nonEmptyTexts = textsToTranslate.filter(text => text.trim().length > 0);
      
      if (nonEmptyTexts.length === 0) return;

      // Translate in batches
      const translatedTexts = await translationService.translateBatch(nonEmptyTexts, languageCode);
      
      // Apply translations
      let textIndex = 0;
      translatableElements.forEach((element, index) => {
        const originalText = textsToTranslate[index];
        if (originalText.trim().length > 0) {
          element.textContent = translatedTexts[textIndex] || originalText;
          textIndex++;
        }
      });

      console.log(`Applied ${translatedTexts.length} translations to current page`);
    } catch (error) {
      console.error('Error applying translations:', error);
      // Fallback to page reload if translation fails
      setTimeout(() => window.location.reload(), 1000);
    }
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
    localStorage.removeItem('manualLanguageSelection');
    window.location.reload();
  }
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
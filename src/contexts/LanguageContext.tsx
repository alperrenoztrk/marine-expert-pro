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
    
    // Listen for language changes in browser/system
    const handleLanguageChange = () => {
      const newBrowserLang = translationService.getBrowserLanguage();
      if (newBrowserLang !== currentLanguage) {
        console.log(`Browser language changed to: ${newBrowserLang}`);
        changeLanguage(newBrowserLang);
      }
    };
    
    // Listen for language change events
    window.addEventListener('languagechange', handleLanguageChange);
    
    // Check periodically for language changes (for mobile apps)
    const languageCheckInterval = setInterval(() => {
      const currentBrowserLang = translationService.getBrowserLanguage();
      const savedLang = localStorage.getItem('preferredLanguage');
      
      if (currentBrowserLang !== savedLang) {
        console.log(`System language changed from ${savedLang} to ${currentBrowserLang}`);
        handleLanguageChange();
      }
    }, 5000); // Check every 5 seconds
    
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
      clearInterval(languageCheckInterval);
    };
  }, [currentLanguage]);

  const initializeLanguage = async () => {
    setIsLoading(true);
    try {
      // Load supported languages
      const languages = await translationService.getSupportedLanguages();
      setSupportedLanguages(languages);

      // Always check current browser/system language
      const currentBrowserLang = translationService.getBrowserLanguage();
      const savedLanguage = localStorage.getItem('preferredLanguage');
      
      // If browser language changed, update automatically
      if (savedLanguage && savedLanguage !== currentBrowserLang) {
        console.log(`Auto-updating language from ${savedLanguage} to ${currentBrowserLang} (system change detected)`);
        setCurrentLanguage(currentBrowserLang);
        localStorage.setItem('preferredLanguage', currentBrowserLang);
        localStorage.removeItem('manualLanguageSelection'); // Reset manual flag since system changed
        
        toast({
          title: "Dil Otomatik Güncellendi",
          description: `Sistem diliniz değişti. Uygulama dili ${translationService.getLanguageName(currentBrowserLang)} olarak güncellendi.`,
        });
      } else if (savedLanguage) {
        // Use saved language if no change detected
        setCurrentLanguage(savedLanguage);
        console.log(`Using saved language: ${savedLanguage}`);
      } else {
        // First time user - use browser language
        setCurrentLanguage(currentBrowserLang);
        localStorage.setItem('preferredLanguage', currentBrowserLang);
        
        toast({
          title: "Dil Algılandı",
          description: `Sistem diliniz (${translationService.getLanguageName(currentBrowserLang)}) otomatik olarak seçildi.`,
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
      
      // Note: No longer setting manualLanguageSelection flag
      // Language will auto-sync with system changes

      // Update document direction for RTL languages
      document.documentElement.dir = rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
      document.documentElement.lang = languageCode;

      const browserLang = translationService.getBrowserLanguage();
      const isSystemLanguage = languageCode === browserLang;
      
      toast({
        title: "Dil Değiştirildi",
        description: isSystemLanguage 
          ? `Uygulama dili ${translationService.getLanguageName(languageCode)} olarak değiştirildi (sistem dili)`
          : `Uygulama dili ${translationService.getLanguageName(languageCode)} olarak değiştirildi (sistem dili değişirse otomatik güncellenecek)`,
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
      const detectedLang = translationService.getBrowserLanguage();
      
      if (detectedLang !== currentLanguage) {
        await changeLanguage(detectedLang);
        toast({
          title: "Sistem Dili Algılandı",
          description: `Dil ${translationService.getLanguageName(detectedLang)} olarak güncellendi`,
        });
      } else {
        toast({
          title: "Dil Zaten Güncel",
          description: `Mevcut dil zaten sistem dili ile eşleşiyor (${translationService.getLanguageName(detectedLang)})`,
        });
      }
    } catch (error) {
      console.error('Auto-detect error:', error);
      toast({
        title: "Algılama Hatası",
        description: "Dil algılanırken hata oluştu",
        variant: "destructive",
      });
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
          const translatedText = translatedTexts[textIndex];
          element.textContent = typeof translatedText === 'string' ? translatedText : originalText;
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
    // Re-detect system language
    const browserLang = translationService.getBrowserLanguage();
    localStorage.setItem('preferredLanguage', browserLang);
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
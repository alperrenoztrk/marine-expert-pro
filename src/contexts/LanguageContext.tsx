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
      // Filter to top-25 if available
      const filtered = languages.filter(l => TOP_25_LANGUAGE_CODES.includes(l.language));
      setSupportedLanguages(filtered.length > 0 ? filtered : languages);

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
      const translatableElements = document.querySelectorAll('[data-translatable]');
      const inputElements = document.querySelectorAll('input[placeholder], textarea[placeholder]');

      const textsToTranslate = Array.from(translatableElements).map(el => el.textContent || '');
      const nonEmptyTexts = textsToTranslate.filter(text => text.trim().length > 0);

      // If nothing explicitly marked, fallback to common UI elements (opt-out via data-no-translate)
      if (nonEmptyTexts.length === 0 && inputElements.length === 0) {
        const fallbackSelector = 'h1,h2,h3,h4,h5,h6,p,button,a,label,li,th,td,small,strong,em,span,div';
        const allCandidates = Array.from(document.querySelectorAll(fallbackSelector))
          .filter(el => !(el as HTMLElement).dataset.noTranslate)
          .slice(0, 200) as HTMLElement[]; // cap for performance
        const texts = allCandidates.map(el => el.textContent || '').map(t => t.trim());
        const nonEmpty = texts.map((t, i) => ({ t, i })).filter(x => x.t.length > 0);
        if (nonEmpty.length > 0) {
          const translated = await translationService.translateBatch(nonEmpty.map(x => x.t), languageCode);
          nonEmpty.forEach((x, idx) => {
            const el = allCandidates[x.i];
            const originalText = (el.dataset.originalText || el.textContent || '').trim();
            if (!el.dataset.originalText) {
              el.dataset.originalText = originalText;
            }
            const newText = translated[idx]?.translatedText || originalText;
            el.textContent = newText;
          });
        }
        console.log(`Fallback applied translations to ${nonEmpty.length} elements`);
        return;
      }

      // Translate visible texts
      if (nonEmptyTexts.length > 0) {
        const translatedTexts = await translationService.translateBatch(nonEmptyTexts, languageCode);
        // Apply translations
        let textIndex = 0;
        translatableElements.forEach((element, index) => {
          const originalText = textsToTranslate[index];
          if (originalText.trim().length > 0) {
            const translatedText = translatedTexts[textIndex]?.translatedText || originalText;
            (element as HTMLElement).dataset.originalText = (element as HTMLElement).dataset.originalText || originalText;
            element.textContent = translatedText;
            textIndex++;
          }
        });
      }

      // Translate placeholders
      if (inputElements.length > 0) {
        const placeholders = Array.from(inputElements).map(el => (el as HTMLInputElement | HTMLTextAreaElement).placeholder || '');
        const nonEmptyPlaceholders = placeholders.filter(p => p.trim().length > 0);
        if (nonEmptyPlaceholders.length > 0) {
          const translatedPlaceholders = await translationService.translateBatch(nonEmptyPlaceholders, languageCode);
          let phIndex = 0;
          inputElements.forEach((element, idx) => {
            const originalPh = placeholders[idx];
            if (originalPh.trim().length > 0) {
              const translated = translatedPlaceholders[phIndex]?.translatedText || originalPh;
              (element as HTMLInputElement | HTMLTextAreaElement).dataset.originalPlaceholder = (element as HTMLInputElement | HTMLTextAreaElement).dataset.originalPlaceholder || originalPh;
              (element as HTMLInputElement | HTMLTextAreaElement).placeholder = translated;
              phIndex++;
            }
          });
        }
      }

      console.log(`Applied translations (lang=${languageCode}) to ${nonEmptyTexts.length} text elements and ${inputElements.length} placeholders`);
    } catch (error) {
      console.error('Error applying translations:', error);
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
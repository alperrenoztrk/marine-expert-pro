import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/safeClient';

interface SupportedLanguage {
  language: string;
  name: string;
  displayName: string;
}

interface LanguageContextType {
  currentLanguage: string;
  supportedLanguages: SupportedLanguage[];
  isLoading: boolean;
  changeLanguage: (languageCode: string) => void;
  getLanguageName: (code: string) => string;
  isRTL: boolean;
  resetLanguagePreferences: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Supported languages - 25 languages
const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { language: 'tr', name: 'Turkish', displayName: 'Türkçe' },
  { language: 'en', name: 'English', displayName: 'English' },
  { language: 'es', name: 'Spanish', displayName: 'Español' },
  { language: 'de', name: 'German', displayName: 'Deutsch' },
  { language: 'fr', name: 'French', displayName: 'Français' },
  { language: 'it', name: 'Italian', displayName: 'Italiano' },
  { language: 'pt', name: 'Portuguese', displayName: 'Português' },
  { language: 'ru', name: 'Russian', displayName: 'Русский' },
  { language: 'ja', name: 'Japanese', displayName: '日本語' },
  { language: 'ko', name: 'Korean', displayName: '한국어' },
  { language: 'zh-CN', name: 'Chinese (Simplified)', displayName: '中文 (简体)' },
  { language: 'ar', name: 'Arabic', displayName: 'العربية' },
  { language: 'hi', name: 'Hindi', displayName: 'हिन्दी' },
  { language: 'nl', name: 'Dutch', displayName: 'Nederlands' },
  { language: 'sv', name: 'Swedish', displayName: 'Svenska' },
  { language: 'no', name: 'Norwegian', displayName: 'Norsk' },
  { language: 'da', name: 'Danish', displayName: 'Dansk' },
  { language: 'fi', name: 'Finnish', displayName: 'Suomi' },
  { language: 'pl', name: 'Polish', displayName: 'Polski' },
  { language: 'cs', name: 'Czech', displayName: 'Čeština' },
  { language: 'hu', name: 'Hungarian', displayName: 'Magyar' },
  { language: 'ro', name: 'Romanian', displayName: 'Română' },
  { language: 'el', name: 'Greek', displayName: 'Ελληνικά' },
  { language: 'bg', name: 'Bulgarian', displayName: 'Български' },
  { language: 'uk', name: 'Ukrainian', displayName: 'Українська' }
];

// Translation cache to avoid repeated API calls
const translationCache = new Map<string, string>();

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('tr');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const languageRef = useRef<string>('tr');

  // RTL languages
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  const isRTL = rtlLanguages.includes(currentLanguage);

  useEffect(() => {
    // Simple initialization without DOM manipulation
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'tr';
    const validLanguage = SUPPORTED_LANGUAGES.find(lang => lang.language === savedLanguage) 
      ? savedLanguage 
      : 'tr';
    
    setCurrentLanguage(validLanguage);
    setIsLoading(false);
  }, []);

  // Keep a ref of the latest language for observers
  useEffect(() => {
    languageRef.current = currentLanguage;
  }, [currentLanguage]);

  // Helper: translate text using Lovable AI translate edge function
  const translateText = async (text: string, targetLang: string): Promise<string> => {
    if (!text || text.trim() === '') return text;
    if (targetLang === 'tr') return text; // Already in Turkish
    
    const cacheKey = `${text}:${targetLang}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          text,
          targetLanguage: targetLang,
          sourceLanguage: 'tr',
        }),
      });

      if (!response.ok) {
        console.error('Translation HTTP error:', response.status, await response.text());
        return text;
      }

      const data = await response.json();
      const translated = data?.translatedText || text;
      translationCache.set(cacheKey, translated);
      return translated;
    } catch (error) {
      console.error('Translation request failed:', error);
      return text;
    }
  };

  // Helper: translate a single element marked with data-translatable
  const translateElementText = async (el: Element, languageCode: string) => {
    const element = el as HTMLElement;
    const originalTextAttr = element.getAttribute('data-original-text');
    const originalText = originalTextAttr != null ? originalTextAttr : (element.textContent || '').trim();
    if (originalTextAttr == null) {
      element.setAttribute('data-original-text', originalText);
    }
    const translated = await translateText(originalText, languageCode);
    if (translated && element.textContent !== translated) {
      element.textContent = translated;
    }
  };

  // Helper: translate placeholder for inputs/textarea marked with data-translatable-placeholder
  const translateElementPlaceholder = async (el: Element, languageCode: string) => {
    const element = el as HTMLInputElement | HTMLTextAreaElement;
    const originalPlaceholderAttr = element.getAttribute('data-original-placeholder');
    const originalPlaceholder = originalPlaceholderAttr != null ? originalPlaceholderAttr : (element.placeholder || '').trim();
    if (originalPlaceholderAttr == null) {
      element.setAttribute('data-original-placeholder', originalPlaceholder);
    }
    const translated = await translateText(originalPlaceholder, languageCode);
    if (translated && element.placeholder !== translated) {
      element.placeholder = translated;
    }
  };

  // Translate an element and its descendants
  const translateNode = async (node: Element, languageCode: string) => {
    if ((node as Element).hasAttribute && (node as Element).hasAttribute('data-translatable')) {
      await translateElementText(node, languageCode);
    }
    if ((node as Element).hasAttribute && (node as Element).hasAttribute('data-translatable-placeholder')) {
      await translateElementPlaceholder(node, languageCode);
    }
    const textNodes = node.querySelectorAll('[data-translatable]');
    await Promise.all(Array.from(textNodes).map(el => translateElementText(el, languageCode)));
    const placeholderNodes = node.querySelectorAll('[data-translatable-placeholder]');
    await Promise.all(Array.from(placeholderNodes).map(el => translateElementPlaceholder(el, languageCode)));
  };

  // Translate the whole document
  const translateDocument = async (languageCode: string) => {
    if (typeof document === 'undefined') return;
    await translateNode(document.body, languageCode);
  };

  const changeLanguage = (languageCode: string) => {
    if (languageCode === currentLanguage) return;

    const isValidLanguage = SUPPORTED_LANGUAGES.find(lang => lang.language === languageCode);
    if (!isValidLanguage) return;

    setCurrentLanguage(languageCode);
    localStorage.setItem('preferredLanguage', languageCode);

    toast({
      title: "Dil Değiştirildi",
      description: `Uygulama dili ${getLanguageName(languageCode)} olarak değiştirildi`,
    });
  };

  // Update document language/dir and apply translations when language changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    translateDocument(currentLanguage);
  }, [currentLanguage, isRTL]);

  // Observe DOM changes to translate dynamically added elements
  useEffect(() => {
    if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') return;
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            translateNode(node as Element, languageRef.current).catch(console.error);
          }
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const getLanguageName = (code: string): string => {
    return SUPPORTED_LANGUAGES.find(lang => lang.language === code)?.displayName || code;
  };

  const resetLanguagePreferences = () => {
    localStorage.removeItem('preferredLanguage');
    setCurrentLanguage('tr');
    
    toast({
      title: "Ayarlar Sıfırlandı",
      description: "Dil ayarları varsayılan değerlere döndürüldü",
    });
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    isLoading,
    changeLanguage,
    getLanguageName,
    isRTL,
    resetLanguagePreferences,
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

// Simple translation utility (no hooks, no re-renders)
// This is kept for backwards compatibility but doesn't use the API
export const getTranslation = (key: string, defaultText: string = '', language: string = 'tr') => {
  return defaultText;
};
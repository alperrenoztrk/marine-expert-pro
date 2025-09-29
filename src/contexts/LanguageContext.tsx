import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
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
  changeLanguage: (languageCode: string) => void;
  getLanguageName: (code: string) => string;
  isRTL: boolean;
  resetLanguagePreferences: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple language configuration
const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { language: 'en', name: 'English', displayName: 'English' },
  { language: 'tr', name: 'Turkish', displayName: 'Türkçe' },
  { language: 'es', name: 'Spanish', displayName: 'Español' },
  { language: 'fr', name: 'French', displayName: 'Français' },
  { language: 'de', name: 'German', displayName: 'Deutsch' }
];

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

  // Helper: translate a single element marked with data-translatable
  const translateElementText = (el: Element, languageCode: string) => {
    const element = el as HTMLElement;
    const originalTextAttr = element.getAttribute('data-original-text');
    const originalText = originalTextAttr != null ? originalTextAttr : (element.textContent || '').trim();
    if (originalTextAttr == null) {
      element.setAttribute('data-original-text', originalText);
    }
    const translated = getTranslation('', originalText, languageCode);
    if (translated && element.textContent !== translated) {
      element.textContent = translated;
    }
  };

  // Helper: translate placeholder for inputs/textarea marked with data-translatable-placeholder
  const translateElementPlaceholder = (el: Element, languageCode: string) => {
    const element = el as HTMLInputElement | HTMLTextAreaElement;
    const originalPlaceholderAttr = element.getAttribute('data-original-placeholder');
    const originalPlaceholder = originalPlaceholderAttr != null ? originalPlaceholderAttr : (element.placeholder || '').trim();
    if (originalPlaceholderAttr == null) {
      element.setAttribute('data-original-placeholder', originalPlaceholder);
    }
    const translated = getTranslation('', originalPlaceholder, languageCode);
    if (translated && element.placeholder !== translated) {
      element.placeholder = translated;
    }
  };

  // Translate an element and its descendants
  const translateNode = (node: Element, languageCode: string) => {
    if ((node as Element).hasAttribute && (node as Element).hasAttribute('data-translatable')) {
      translateElementText(node, languageCode);
    }
    if ((node as Element).hasAttribute && (node as Element).hasAttribute('data-translatable-placeholder')) {
      translateElementPlaceholder(node, languageCode);
    }
    const textNodes = node.querySelectorAll('[data-translatable]');
    textNodes.forEach(el => translateElementText(el, languageCode));
    const placeholderNodes = node.querySelectorAll('[data-translatable-placeholder]');
    placeholderNodes.forEach(el => translateElementPlaceholder(el, languageCode));
  };

  // Translate the whole document
  const translateDocument = (languageCode: string) => {
    if (typeof document === 'undefined') return;
    translateNode(document.body, languageCode);
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
            translateNode(node as Element, languageRef.current);
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
export const getTranslation = (key: string, defaultText: string = '', language: string = 'tr') => {
  const translations: { [key: string]: { [key: string]: string } } = {
    'tr': {
      'Maritime Calculator': 'Denizcilik Hesaplayıcısı',
      'Ask Assistant': 'Asistana Sor',
      'Stability': 'Stabilite',
      'Navigation': 'Seyir',
      'Safety': 'Güvenlik',
      'Calculations': 'Hesaplamalar',
      'Settings': 'Ayarlar',
      'Home': 'Ana Sayfa'
    },
    'en': {
      'Denizcilik Hesaplayıcısı': 'Maritime Calculator',
      'Asistana Sor': 'Ask Assistant',
      'Stabilite': 'Stability',
      'Seyir': 'Navigation',
      'Güvenlik': 'Safety',
      'Hesaplamalar': 'Calculations',
      'Ayarlar': 'Settings',
      'Ana Sayfa': 'Home'
    }
  };

  const langTranslations = translations[language];
  if (langTranslations && langTranslations[defaultText]) {
    return langTranslations[defaultText];
  }
  return defaultText;
};
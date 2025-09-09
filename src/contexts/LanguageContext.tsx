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

  // RTL languages
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  const isRTL = rtlLanguages.includes(currentLanguage);

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = () => {
    try {
      setIsLoading(true);
      
      // Get saved language or default to Turkish
      const savedLanguage = localStorage.getItem('preferredLanguage') || 'tr';
      
      // Validate language is supported
      const validLanguage = SUPPORTED_LANGUAGES.find(lang => lang.language === savedLanguage) 
        ? savedLanguage 
        : 'tr';
      
      setCurrentLanguage(validLanguage);
      
      // Set document attributes
      document.documentElement.dir = rtlLanguages.includes(validLanguage) ? 'rtl' : 'ltr';
      document.documentElement.lang = validLanguage;
      
    } catch (error) {
      console.error('Language initialization error:', error);
      setCurrentLanguage('tr');
      document.documentElement.lang = 'tr';
      document.documentElement.dir = 'ltr';
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = (languageCode: string) => {
    try {
      if (languageCode === currentLanguage) return;

      // Validate language is supported
      const isValidLanguage = SUPPORTED_LANGUAGES.find(lang => lang.language === languageCode);
      if (!isValidLanguage) {
        console.warn(`Unsupported language: ${languageCode}`);
        return;
      }

      setCurrentLanguage(languageCode);
      localStorage.setItem('preferredLanguage', languageCode);

      // Update document attributes
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
    }
  };

  const getLanguageName = (code: string): string => {
    return SUPPORTED_LANGUAGES.find(lang => lang.language === code)?.displayName || code;
  };

  const resetLanguagePreferences = () => {
    try {
      localStorage.removeItem('preferredLanguage');
      localStorage.removeItem('manualLanguageSelection');
      
      // Clear any translation cache
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('translation_')) {
          localStorage.removeItem(key);
        }
      });
      
      // Reset to Turkish
      setCurrentLanguage('tr');
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'tr';
      
      toast({
        title: "Ayarlar Sıfırlandı",
        description: "Dil ayarları varsayılan değerlere döndürüldü",
      });
    } catch (error) {
      console.error('Reset preferences error:', error);
    }
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

// Simple translation hook (no API calls)
export const useTranslation = (key: string, defaultText: string = '') => {
  const { currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState(defaultText);

  useEffect(() => {
    // Simple fallback translation dictionary
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

    const langTranslations = translations[currentLanguage];
    if (langTranslations && langTranslations[defaultText]) {
      setTranslatedText(langTranslations[defaultText]);
    } else {
      setTranslatedText(defaultText);
    }
  }, [currentLanguage, defaultText]);

  return { text: translatedText, isLoading: false };
};
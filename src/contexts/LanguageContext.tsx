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
    // Simple initialization without DOM manipulation
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'tr';
    const validLanguage = SUPPORTED_LANGUAGES.find(lang => lang.language === savedLanguage) 
      ? savedLanguage 
      : 'tr';
    
    setCurrentLanguage(validLanguage);
    setIsLoading(false);
  }, []);

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
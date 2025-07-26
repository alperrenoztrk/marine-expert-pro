import { useState, useEffect, createContext, useContext } from 'react';
import { translateText } from '@/utils/translator';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (langCode: string) => Promise<void>;
  isTranslating: boolean;
  translateElement: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback hook when context is not available
    const [currentLanguage, setCurrentLanguage] = useState('tr');
    const [isTranslating, setIsTranslating] = useState(false);

    const setLanguage = async (langCode: string) => {
      setIsTranslating(true);
      try {
        setCurrentLanguage(langCode);
        localStorage.setItem('maritime-calculator-language', langCode);
        
        // Translate all text elements on the page
        if (langCode !== 'tr') {
          await translatePageContent(langCode);
        } else {
          // Reload page to restore original Turkish content
          window.location.reload();
        }
      } finally {
        setIsTranslating(false);
      }
    };

    const translateElement = async (text: string): Promise<string> => {
      if (currentLanguage === 'tr') return text;
      return await translateText(text, 'tr', currentLanguage);
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
  }
  return context;
};

// Sayfa içeriğini çevir
async function translatePageContent(targetLang: string) {
  const elementsToTranslate = document.querySelectorAll('[data-translatable]');
  
  for (const element of elementsToTranslate) {
    const htmlElement = element as HTMLElement;
    const originalText = htmlElement.dataset.originalText || htmlElement.textContent;
    
    if (originalText) {
      // Store original text for restoration
      if (!htmlElement.dataset.originalText) {
        htmlElement.dataset.originalText = originalText;
      }

      try {
        const translatedText = await translateText(originalText, 'tr', targetLang);
        htmlElement.textContent = translatedText;
      } catch (error) {
        console.error('Translation error for element:', error);
      }
    }
  }

  // Translate placeholder texts
  const inputElements = document.querySelectorAll('input[placeholder], textarea[placeholder]');
  for (const element of inputElements) {
    const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
    const originalPlaceholder = inputElement.dataset.originalPlaceholder || inputElement.placeholder;
    
    if (originalPlaceholder) {
      if (!inputElement.dataset.originalPlaceholder) {
        inputElement.dataset.originalPlaceholder = originalPlaceholder;
      }

      try {
        const translatedPlaceholder = await translateText(originalPlaceholder, 'tr', targetLang);
        inputElement.placeholder = translatedPlaceholder;
      } catch (error) {
        console.error('Translation error for placeholder:', error);
      }
    }
  }
}

// Translation Provider Component
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const languageHook = useLanguage();
  
  return (
    <LanguageContext.Provider value={languageHook}>
      {children}
    </LanguageContext.Provider>
  );
};
import { useState, useEffect } from 'react';
import { googleTranslator } from '@/utils/googleTranslator';

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

  // Tarayıcı dilini algıla ve otomatik dil seç
  useEffect(() => {
    const detectBrowserLanguage = () => {
      const browserLang = navigator.language.toLowerCase();
      const langCode = browserLang.split('-')[0]; // 'en-US' -> 'en'
      
      // Desteklenen dillerde varsa kullan
      if (supportedLanguages.includes(langCode)) {
        setDetectedLanguage(langCode);
        setCurrentLanguage(langCode);
        localStorage.setItem('maritime-calculator-language', langCode);
      } else {
        // Varsayılan olarak İngilizce
        setDetectedLanguage('en');
        setCurrentLanguage('en');
        localStorage.setItem('maritime-calculator-language', 'en');
      }
    };

    // Önceden seçilmiş dil var mı kontrol et
    const savedLanguage = localStorage.getItem('maritime-calculator-language');
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      setDetectedLanguage(savedLanguage);
    } else {
      detectBrowserLanguage();
    }
  }, []);

  // Dil değiştirme fonksiyonu
  const setLanguage = async (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      setCurrentLanguage(lang);
      localStorage.setItem('maritime-calculator-language', lang);
      
      // Sayfa içeriğini otomatik çevir
      if (lang !== 'tr') {
        await translatePageContent(lang);
      } else {
        // Türkçe'ye dönerken sayfayı yenilemeden orijinal içerik geri yükle
        const elementsToTranslate = document.querySelectorAll('[data-translatable]');
        elementsToTranslate.forEach((el)=>{
          const html = el as HTMLElement;
          const original = html.dataset.originalText;
          if (original) html.textContent = original;
        });
        const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        inputs.forEach((el)=>{
          const input = el as HTMLInputElement | HTMLTextAreaElement;
          const originalPh = input.dataset.originalPlaceholder;
          if (originalPh) input.placeholder = originalPh;
        });
      }
    }
  };

  // Metin çeviri fonksiyonu
  const translateContent = async (text: string, targetLang?: string): Promise<string> => {
    const target = targetLang || currentLanguage;
    if (target === 'tr' || !text.trim()) return text;

    try {
      setIsTranslating(true);
      const result = await googleTranslator.translate({
        text,
        targetLang: target,
        sourceLang: 'tr'
      });
      return result.translatedText;
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

// Sayfa içeriğini otomatik çevir
async function translatePageContent(targetLang: string) {
  const elementsToTranslate = document.querySelectorAll('[data-translatable]');
  
  for (const element of elementsToTranslate) {
    const htmlElement = element as HTMLElement;
    const originalText = htmlElement.dataset.originalText || htmlElement.textContent;
    
    if (originalText) {
      // Orijinal metni sakla
      if (!htmlElement.dataset.originalText) {
        htmlElement.dataset.originalText = originalText;
      }

      try {
        const result = await googleTranslator.translate({
          text: originalText,
          targetLang: targetLang,
          sourceLang: 'tr'
        });
        const translatedText = result.translatedText;
        htmlElement.textContent = translatedText;
      } catch (error) {
        console.error('Element translation error:', error);
      }
    }
  }

  // Placeholder metinlerini çevir
  const inputElements = document.querySelectorAll('input[placeholder], textarea[placeholder]');
  for (const element of inputElements) {
    const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
    const originalPlaceholder = inputElement.dataset.originalPlaceholder || inputElement.placeholder;
    
    if (originalPlaceholder) {
      if (!inputElement.dataset.originalPlaceholder) {
        inputElement.dataset.originalPlaceholder = originalPlaceholder;
      }

      try {
        const result = await googleTranslator.translate({
          text: originalPlaceholder,
          targetLang: targetLang,
          sourceLang: 'tr'
        });
        const translatedPlaceholder = result.translatedText;
        inputElement.placeholder = translatedPlaceholder;
      } catch (error) {
        console.error('Placeholder translation error:', error);
      }
    }
  }
}
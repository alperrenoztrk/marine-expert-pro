// Microsoft Translator API utility
import { supabase } from '@/integrations/supabase/client';

interface TranslationResponse {
  translations: Array<{
    text: string;
    to: string;
  }>;
}

// Microsoft Translator Text API endpoint
const TRANSLATOR_ENDPOINT = 'https://api.cognitive.microsofttranslator.com/translate';

// Supabase Edge Function üzerinden çeviri yap
export const translateText = async (
  text: string, 
  fromLang: string = 'tr', 
  toLang: string = 'en'
): Promise<string> => {
  try {
    // Eğer aynı dillerse çeviri yapma
    if (fromLang === toLang) return text;

    // Boş text kontrolü
    if (!text.trim()) return text;

    // Supabase Edge Function'a çeviri isteği gönder
    const { data, error } = await supabase.functions.invoke('translate', {
      body: {
        text,
        from: fromLang,
        to: toLang
      }
    });

    if (error) {
      console.error('Translation function error:', error);
      return text; // Hata durumunda orijinal metni döndür
    }

    return data?.translatedText || text;

  } catch (error) {
    console.error('Translation error:', error);
    return text; // Hata durumunda orijinal metni döndür
  }
};

// Microsoft Translator direkt API çağrısı (alternatif)
export const translateTextDirect = async (
  text: string,
  fromLang: string = 'tr',
  toLang: string = 'en',
  apiKey?: string
): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error('API key is required for direct translation');
    }

    if (fromLang === toLang) return text;
    if (!text.trim()) return text;

    const response = await fetch(
      `${TRANSLATOR_ENDPOINT}?api-version=3.0&from=${fromLang}&to=${toLang}`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Ocp-Apim-Subscription-Region': 'global', // veya specific region
          'Content-Type': 'application/json',
          'X-ClientTraceId': crypto.randomUUID(),
        },
        body: JSON.stringify([{ text }])
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Microsoft Translator API error:', response.status, errorText);
      return text;
    }

    const data: TranslationResponse[] = await response.json();
    
    if (data && data[0] && data[0].translations && data[0].translations[0]) {
      return data[0].translations[0].text;
    }

    return text;

  } catch (error) {
    console.error('Direct translation error:', error);
    return text;
  }
};

// Batch çeviri (birden fazla text)
export const translateBatch = async (
  texts: string[],
  fromLang: string = 'tr',
  toLang: string = 'en'
): Promise<string[]> => {
  try {
    const promises = texts.map(text => translateText(text, fromLang, toLang));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts; // Hata durumunda orijinal tekstleri döndür
  }
};

// Dil algılama
export const detectLanguage = async (text: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('detect-language', {
      body: { text }
    });

    if (error) {
      console.error('Language detection error:', error);
      return 'tr'; // Default to Turkish
    }

    return data?.language || 'tr';

  } catch (error) {
    console.error('Language detection error:', error);
    return 'tr'; // Default to Turkish
  }
};

// Desteklenen dillerin listesi
export const SUPPORTED_LANGUAGES = {
  'tr': 'Türkçe',
  'en': 'English',
  'es': 'Español',
  'de': 'Deutsch',
  'fr': 'Français',
  'it': 'Italiano',
  'pt': 'Português',
  'ru': 'Русский',
  'ja': '日本語',
  'ko': '한국어',
  'zh': '中文',
  'ar': 'العربية',
  'hi': 'हिन्दी',
  'nl': 'Nederlands',
  'sv': 'Svenska',
  'no': 'Norsk',
  'da': 'Dansk',
  'fi': 'Suomi',
  'pl': 'Polski',
  'cs': 'Čeština',
  'hu': 'Magyar',
  'ro': 'Română',
  'el': 'Ελληνικά',
  'bg': 'Български',
  'hr': 'Hrvatski',
  'uk': 'Українська',
};

// Dil kodunu dil adına çevir
export const getLanguageName = (langCode: string): string => {
  return SUPPORTED_LANGUAGES[langCode as keyof typeof SUPPORTED_LANGUAGES] || langCode;
};

// Fallback çeviri sözlüğü (offline çalışma için)
export const getFallbackTranslation = (text: string, fromLang: string, toLang: string): string | null => {
  const maritimeTerms: { [key: string]: { [key: string]: string } } = {
    // Türkçe -> İngilizce
    'tr_en': {
      'Denizcilik Hesaplayıcısı': 'Maritime Calculator',
      'Asistana Sor': 'Ask Assistant',
      'Stabilite': 'Stability',
      'Seyir': 'Navigation',
      'Hidrodinamik': 'Hydrodynamics',
      'Makine': 'Engine',
      'Kargo': 'Cargo',
      'Balast': 'Ballast',
      'Trim': 'Trim',
      'Yapısal': 'Structural',
      'Güvenlik': 'Safety',
      'Emisyon': 'Emission',
      'GM hesaplama formülü': 'GM calculation formula',
      'Trim açısı nasıl bulunur?': 'How to find trim angle?',
      'Stabilite kriterleri nelerdir?': 'What are stability criteria?',
      'Hesaplayıcıya Dön': 'Back to Calculator',
      'Maritime AI Asistanı': 'Maritime AI Assistant',
      'Sık Sorulan Konular': 'Frequently Asked Topics'
    },
    // İngilizce -> Türkçe  
    'en_tr': {
      'Maritime Calculator': 'Denizcilik Hesaplayıcısı',
      'Ask Assistant': 'Asistana Sor',
      'Stability': 'Stabilite',
      'Navigation': 'Seyir',
      'Hydrodynamics': 'Hidrodinamik',
      'Engine': 'Makine',
      'Cargo': 'Kargo',
      'Ballast': 'Balast',
      'Trim': 'Trim',
      'Structural': 'Yapısal',
      'Safety': 'Güvenlik',
      'Emission': 'Emisyon',
      'Back to Calculator': 'Hesaplayıcıya Dön',
      'Maritime AI Assistant': 'Maritime AI Asistanı',
      'Frequently Asked Topics': 'Sık Sorulan Konular'
    }
  };

  const translationKey = `${fromLang}_${toLang}`;
  const termDict = maritimeTerms[translationKey];
  
  if (termDict && termDict[text]) {
    return termDict[text];
  }

  // Kısmi eşleşme kontrolü
  if (termDict) {
    for (const [original, translated] of Object.entries(termDict)) {
      if (text.toLowerCase().includes(original.toLowerCase())) {
        return text.replace(new RegExp(original, 'gi'), translated);
      }
    }
  }

  return null;
};
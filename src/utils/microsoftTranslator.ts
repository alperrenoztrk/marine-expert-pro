// Microsoft Translator API integration
interface TranslationResponse {
  translations: Array<{
    text: string;
    to: string;
  }>;
}

interface DetectionResponse {
  language: string;
  score: number;
}

// API Configuration
const TRANSLATOR_ENDPOINT = 'https://api.cognitive.microsofttranslator.com';
const API_VERSION = '3.0';

// API Keys (production'da environment'dan gelecek)
const API_KEY = '2DPwjX2TTumE846XQABnsAMalqk6PWy45nQ16Ttt0zIBSbsbojzBJQQJ99BGACi5YpzXJ3w3AAAbACOGvrHn';
const REGION = 'global'; // Azure region

// Dil algılama
export const detectLanguage = async (text: string): Promise<string> => {
  try {
    if (!text.trim()) return 'tr';

    const response = await fetch(
      `${TRANSLATOR_ENDPOINT}/detect?api-version=${API_VERSION}`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': API_KEY,
          'Ocp-Apim-Subscription-Region': REGION,
          'Content-Type': 'application/json',
          'X-ClientTraceId': crypto.randomUUID(),
        },
        body: JSON.stringify([{ text }])
      }
    );

    if (!response.ok) {
      console.error('Language detection failed:', response.status);
      return 'tr'; // Fallback to Turkish
    }

    const data: DetectionResponse[] = await response.json();
    
    if (data && data[0] && data[0].language) {
      return data[0].language;
    }

    return 'tr';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'tr';
  }
};

// Metin çevirisi
export const translateText = async (
  text: string,
  fromLang: string = 'tr',
  toLang: string = 'en'
): Promise<string> => {
  try {
    // Aynı dillerse çeviri yapma
    if (fromLang === toLang) return text;
    
    // Boş text kontrolü
    if (!text.trim()) return text;

    // Fallback kontrolü - API olmadığında
    const fallbackResult = getFallbackTranslation(text, fromLang, toLang);
    if (fallbackResult) {
      console.log('Using fallback translation for:', text);
    }

    const response = await fetch(
      `${TRANSLATOR_ENDPOINT}/translate?api-version=${API_VERSION}&from=${fromLang}&to=${toLang}`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': API_KEY,
          'Ocp-Apim-Subscription-Region': REGION,
          'Content-Type': 'application/json',
          'X-ClientTraceId': crypto.randomUUID(),
        },
        body: JSON.stringify([{ text }])
      }
    );

    if (!response.ok) {
      console.error('Translation failed:', response.status);
      return fallbackResult || text;
    }

    const data: TranslationResponse[] = await response.json();
    
    if (data && data[0] && data[0].translations && data[0].translations[0]) {
      const translatedText = data[0].translations[0].text;
      console.log(`Translated "${text}" from ${fromLang} to ${toLang}: "${translatedText}"`);
      return translatedText;
    }

    return fallbackResult || text;
  } catch (error) {
    console.error('Translation error:', error);
    const fallbackResult = getFallbackTranslation(text, fromLang, toLang);
    return fallbackResult || text;
  }
};

// Batch çeviri (birden fazla metin)
export const translateBatch = async (
  texts: string[],
  fromLang: string = 'tr',
  toLang: string = 'en'
): Promise<string[]> => {
  try {
    if (fromLang === toLang) return texts;

    const requestBody = texts.map(text => ({ text }));

    const response = await fetch(
      `${TRANSLATOR_ENDPOINT}/translate?api-version=${API_VERSION}&from=${fromLang}&to=${toLang}`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': API_KEY,
          'Ocp-Apim-Subscription-Region': REGION,
          'Content-Type': 'application/json',
          'X-ClientTraceId': crypto.randomUUID(),
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      console.error('Batch translation failed:', response.status);
      return texts;
    }

    const data: TranslationResponse[] = await response.json();
    
    return data.map((item, index) => {
      if (item.translations && item.translations[0]) {
        return item.translations[0].text;
      }
      return texts[index];
    });
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
};

// Desteklenen dillerin listesi
export const SUPPORTED_LANGUAGES = {
  'tr': { name: 'Türkçe', flag: '🇹🇷' },
  'en': { name: 'English', flag: '🇺🇸' },
  'es': { name: 'Español', flag: '🇪🇸' },
  'de': { name: 'Deutsch', flag: '🇩🇪' },
  'fr': { name: 'Français', flag: '🇫🇷' },
  'it': { name: 'Italiano', flag: '🇮🇹' },
  'pt': { name: 'Português', flag: '🇧🇷' },
  'ru': { name: 'Русский', flag: '🇷🇺' },
  'ja': { name: '日本語', flag: '🇯🇵' },
  'ko': { name: '한국어', flag: '🇰🇷' },
  'zh': { name: '中文', flag: '🇨🇳' },
  'ar': { name: 'العربية', flag: '🇸🇦' },
  'hi': { name: 'हिन्दी', flag: '🇮🇳' },
  'nl': { name: 'Nederlands', flag: '🇳🇱' },
  'sv': { name: 'Svenska', flag: '🇸🇪' },
  'no': { name: 'Norsk', flag: '🇳🇴' },
  'da': { name: 'Dansk', flag: '🇩🇰' },
  'fi': { name: 'Suomi', flag: '🇫🇮' },
  'pl': { name: 'Polski', flag: '🇵🇱' },
  'cs': { name: 'Čeština', flag: '🇨🇿' },
  'hu': { name: 'Magyar', flag: '🇭🇺' },
  'ro': { name: 'Română', flag: '🇷🇴' },
  'el': { name: 'Ελληνικά', flag: '🇬🇷' },
  'bg': { name: 'Български', flag: '🇧🇬' },
  'hr': { name: 'Hrvatski', flag: '🇭🇷' },
  'uk': { name: 'Українська', flag: '🇺🇦' },
};

// Fallback çeviri sözlüğü (API olmadığında)
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
      'Hesaplayıcıya Dön': 'Back to Calculator',
      'Maritime AI Asistanı': 'Maritime AI Assistant',
      'Sık Sorulan Konular': 'Frequently Asked Topics',
      'Tüm denizcilik hesaplamalarınız tek sayfada': 'All your maritime calculations in one page',
      'Maritime mühendisliği konularında AI asistanınız': 'Your AI assistant for maritime engineering topics'
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

// Dil kodunu dil adına ve bayrağa çevir
export const getLanguageInfo = (langCode: string) => {
  return SUPPORTED_LANGUAGES[langCode as keyof typeof SUPPORTED_LANGUAGES] || 
         { name: langCode.toUpperCase(), flag: '🌍' };
};
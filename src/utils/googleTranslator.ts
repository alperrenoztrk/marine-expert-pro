const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

export interface TranslateOptions {
  text: string;
  targetLang: string;
  sourceLang?: string;
}

export interface TranslateResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

export class GoogleTranslator {
  private static instance: GoogleTranslator;
  private cache: Map<string, string> = new Map();

  private constructor() {}

  static getInstance(): GoogleTranslator {
    if (!GoogleTranslator.instance) {
      GoogleTranslator.instance = new GoogleTranslator();
    }
    return GoogleTranslator.instance;
  }

  private getCacheKey(text: string, targetLang: string): string {
    return `${targetLang}:${text}`;
  }

  async translate({ text, targetLang, sourceLang }: TranslateOptions): Promise<TranslateResponse> {
    if (!API_KEY) {
      console.warn('Google Translate API key is not configured');
      return { translatedText: text };
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, targetLang);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return { translatedText: cached };
    }

    try {
      const params = new URLSearchParams({
        key: API_KEY,
        q: text,
        target: targetLang,
        format: 'text'
      });

      if (sourceLang) {
        params.append('source', sourceLang);
      }

      const response = await fetch(`${API_URL}?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      const detectedSourceLanguage = data.data.translations[0].detectedSourceLanguage;

      // Cache the result
      this.cache.set(cacheKey, translatedText);

      return {
        translatedText,
        detectedSourceLanguage
      };
    } catch (error) {
      console.error('Translation error:', error);
      return { translatedText: text };
    }
  }

  async translateBatch(texts: string[], targetLang: string): Promise<string[]> {
    const promises = texts.map(text => 
      this.translate({ text, targetLang }).then(result => result.translatedText)
    );
    return Promise.all(promises);
  }

  async detectLanguage(text: string): Promise<string> {
    if (!API_KEY) {
      return 'tr'; // Default to Turkish
    }

    try {
      const params = new URLSearchParams({
        key: API_KEY,
        q: text
      });

      const response = await fetch(`https://translation.googleapis.com/language/translate/v2/detect?${params}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Language detection error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.detections[0][0].language;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'tr'; // Default to Turkish
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const googleTranslator = GoogleTranslator.getInstance();
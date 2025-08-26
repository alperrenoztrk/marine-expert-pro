interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
  confidence?: number;
}

interface DetectionResponse {
  language: string;
  confidence: number;
  isReliable: boolean;
}

interface SupportedLanguage {
  language: string;
  name: string;
  displayName: string;
}

class GoogleTranslationService {
  private readonly API_KEY = 'AIzaSyDZ81CyuQyQ-FPRgiIx5nULrP-pS8ioZfc';
  private readonly CLOUD_TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';
  private readonly DETECTION_URL = 'https://translation.googleapis.com/language/translate/v2/detect';
  private readonly LANGUAGES_URL = 'https://translation.googleapis.com/language/translate/v2/languages';

  // Maritime terminology dictionary for better translations
  private readonly maritimeTerms: Record<string, Record<string, string>> = {
    en: {
      'SOLAS': 'Safety of Life at Sea',
      'MARPOL': 'Marine Pollution Prevention',
      'COLREG': 'Collision Regulations',
      'IMO': 'International Maritime Organization',
      'ISM': 'International Safety Management',
      'ISPS': 'International Ship and Port Facility Security',
      'MLC': 'Maritime Labour Convention',
      'STCW': 'Standards of Training, Certification and Watchkeeping',
      'DWT': 'Deadweight Tonnage',
      'GRT': 'Gross Register Tonnage',
      'LOA': 'Length Overall',
      'LBP': 'Length Between Perpendiculars',
      'draft': 'ship draft',
      'trim': 'ship trim',
      'ballast': 'ballast water',
      'cargo': 'ship cargo',
      'stability': 'ship stability',
      'metacentric': 'metacentric height'
    },
    tr: {
      'SOLAS': 'Denizde Can Güvenliği Sözleşmesi',
      'MARPOL': 'Gemilerden Kirlenmenin Önlenmesi Sözleşmesi',
      'COLREG': 'Çatışmayı Önleme Düzenlemeleri',
      'IMO': 'Uluslararası Denizcilik Örgütü',
      'ISM': 'Uluslararası Güvenlik Yönetimi',
      'ISPS': 'Uluslararası Gemi ve Liman Tesisi Güvenliği',
      'MLC': 'Denizcilik Çalışma Sözleşmesi',
      'STCW': 'Eğitim, Belgelendirme ve Vardiya Standartları',
      'DWT': 'Deadweight (DWT)',
      'GRT': 'Gross Register Tonnage',
      'LOA': 'Tam Boy (LOA)',
      'LBP': 'Perpendiküller Arası Boy (LBP)',
      'draft': 'su çekimi (draft)',
      'trim': 'trim',
      'ballast': 'balast',
      'cargo': 'yük',
      'stability': 'stabilite',
      'metacentric': 'metasantrik yükseklik (GM)'
    }
  };

  async detectLanguage(text: string): Promise<DetectionResponse> {
    try {
      const response = await fetch(`${this.DETECTION_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text
        })
      });

      if (!response.ok) {
        throw new Error(`Language detection failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const detection = data.data.detections[0][0];

      return {
        language: detection.language,
        confidence: detection.confidence,
        isReliable: detection.isReliable
      };
    } catch (error) {
      console.error('Language detection error:', error);
      // Fallback to browser language
      const browserLang = navigator.language.split('-')[0];
      return {
        language: browserLang,
        confidence: 0.5,
        isReliable: false
      };
    }
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<TranslationResponse> {
    try {
      // Pre-process maritime terms
      const processedText = this.preprocessMaritimeTerms(text, sourceLanguage || 'en');

      const requestBody: any = {
        q: processedText,
        target: targetLanguage,
        format: 'text'
      };

      if (sourceLanguage) {
        requestBody.source = sourceLanguage;
      }

      const response = await fetch(`${this.CLOUD_TRANSLATE_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const translation = data.data.translations[0];

      // Post-process maritime terms
      const finalText = this.postprocessMaritimeTerms(translation.translatedText, targetLanguage);

      return {
        translatedText: finalText,
        detectedSourceLanguage: translation.detectedSourceLanguage,
        confidence: 0.95 // Google Translate generally has high confidence
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  async translateBatch(texts: string[], targetLanguage: string, sourceLanguage?: string): Promise<TranslationResponse[]> {
    try {
      const processedTexts = texts.map(text => 
        this.preprocessMaritimeTerms(text, sourceLanguage || 'en')
      );

      const requestBody: any = {
        q: processedTexts,
        target: targetLanguage,
        format: 'text'
      };

      if (sourceLanguage) {
        requestBody.source = sourceLanguage;
      }

      const response = await fetch(`${this.CLOUD_TRANSLATE_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Batch translation failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.data.translations.map((translation: any) => ({
        translatedText: this.postprocessMaritimeTerms(translation.translatedText, targetLanguage),
        detectedSourceLanguage: translation.detectedSourceLanguage,
        confidence: 0.95
      }));
    } catch (error) {
      console.error('Batch translation error:', error);
      throw error;
    }
  }

  async getSupportedLanguages(targetLanguage?: string): Promise<SupportedLanguage[]> {
    try {
      let url = `${this.LANGUAGES_URL}?key=${this.API_KEY}`;
      if (targetLanguage) {
        url += `&target=${targetLanguage}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to get supported languages: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.languages;
    } catch (error) {
      console.error('Get supported languages error:', error);
      // Return common languages as fallback
      return [
        { language: 'en', name: 'English', displayName: 'English' },
        { language: 'tr', name: 'Turkish', displayName: 'Türkçe' },
        { language: 'es', name: 'Spanish', displayName: 'Español' },
        { language: 'fr', name: 'French', displayName: 'Français' },
        { language: 'de', name: 'German', displayName: 'Deutsch' },
        { language: 'it', name: 'Italian', displayName: 'Italiano' },
        { language: 'pt', name: 'Portuguese', displayName: 'Português' },
        { language: 'ru', name: 'Russian', displayName: 'Русский' },
        { language: 'ja', name: 'Japanese', displayName: '日本語' },
        { language: 'ko', name: 'Korean', displayName: '한국어' },
        { language: 'zh', name: 'Chinese', displayName: '中文' },
        { language: 'ar', name: 'Arabic', displayName: 'العربية' }
      ];
    }
  }

  async autoDetectAndTranslate(text: string, targetLanguage: string): Promise<TranslationResponse> {
    const detection = await this.detectLanguage(text);
    
    if (detection.language === targetLanguage) {
      return {
        translatedText: text,
        detectedSourceLanguage: detection.language,
        confidence: detection.confidence
      };
    }

    return this.translateText(text, targetLanguage, detection.language);
  }

  private preprocessMaritimeTerms(text: string, sourceLanguage: string): string {
    const terms = this.maritimeTerms[sourceLanguage];
    if (!terms) return text;

    let processedText = text;
    Object.keys(terms).forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      processedText = processedText.replace(regex, `[MARITIME_TERM:${term}]`);
    });

    return processedText;
  }

  private postprocessMaritimeTerms(text: string, targetLanguage: string): string {
    const terms = this.maritimeTerms[targetLanguage];
    if (!terms) return text;

    let processedText = text;
    Object.keys(terms).forEach(term => {
      const regex = new RegExp(`\\[MARITIME_TERM:${term}\\]`, 'gi');
      processedText = processedText.replace(regex, terms[term]);
    });

    return processedText;
  }

  getBrowserLanguage(): string {
    const browserLang = navigator.language.split('-')[0];
    const supportedLanguages = ['en', 'tr', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar'];
    
    return supportedLanguages.includes(browserLang) ? browserLang : 'en';
  }

  getLanguageName(languageCode: string): string {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'tr': 'Türkçe',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'it': 'Italiano',
      'pt': 'Português',
      'ru': 'Русский',
      'ja': '日本語',
      'ko': '한국어',
      'zh': '中文',
      'ar': 'العربية'
    };

    return languageNames[languageCode] || languageCode.toUpperCase();
  }

  // Translation Hub specific methods for document translation
  async translateDocument(content: string, targetLanguage: string, documentType: 'solas' | 'marpol' | 'colreg' = 'solas'): Promise<TranslationResponse> {
    // For large documents, we'll use Translation Hub via batch processing
    const chunks = this.chunkText(content, 5000); // 5KB chunks
    const translatedChunks = await this.translateBatch(chunks, targetLanguage);
    
    return {
      translatedText: translatedChunks.map(chunk => chunk.translatedText).join(' '),
      detectedSourceLanguage: translatedChunks[0]?.detectedSourceLanguage,
      confidence: translatedChunks.reduce((avg, chunk) => avg + (chunk.confidence || 0), 0) / translatedChunks.length
    };
  }

  private chunkText(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > chunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          // Sentence is too long, force split
          chunks.push(sentence.substring(0, chunkSize));
          currentChunk = sentence.substring(chunkSize);
        }
      } else {
        currentChunk += sentence + '.';
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}

export const translationService = new GoogleTranslationService();
export type { TranslationResponse, DetectionResponse, SupportedLanguage };
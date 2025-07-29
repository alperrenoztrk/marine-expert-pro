interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryDoc[];
}

interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  publisher?: string[];
  subject?: string[];
  language?: string[];
  cover_i?: number;
  has_fulltext?: boolean;
  public_scan_b?: boolean;
  ia?: string[];
  edition_count?: number;
}

interface OpenLibraryBook {
  key: string;
  title: string;
  authors?: Array<{ name: string; key: string }>;
  publishers?: string[];
  publish_date?: string;
  subjects?: string[];
  description?: string;
  covers?: number[];
  isbn_10?: string[];
  isbn_13?: string[];
  number_of_pages?: number;
  languages?: Array<{ key: string }>;
  works?: Array<{ key: string }>;
}

class OpenLibraryAPIService {
  private readonly API_KEY = 'c42914d723msh5407abeae149ee7p1bfa4fjsn0649a2daef19';
  private readonly BASE_URL = 'https://openlibrary.org';

  async searchBooks(query: string, limit: number = 10): Promise<OpenLibrarySearchResponse> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,first_publish_year,isbn,publisher,subject,language,cover_i,has_fulltext,public_scan_b,ia,edition_count`,
        {
          headers: {
            'User-Agent': 'Maritime-Calculator-App/1.0 (contact@maritime-app.com)',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Open Library API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Open Library Search Error:', error);
      throw error;
    }
  }

  async getBookDetails(key: string): Promise<OpenLibraryBook> {
    try {
      const response = await fetch(`${this.BASE_URL}${key}.json`, {
        headers: {
          'User-Agent': 'Maritime-Calculator-App/1.0 (contact@maritime-app.com)',
        }
      });

      if (!response.ok) {
        throw new Error(`Open Library API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Open Library Book Details Error:', error);
      throw error;
    }
  }

  async searchSOLAS(): Promise<OpenLibrarySearchResponse> {
    const searchTerms = [
      'SOLAS Convention',
      'Safety of Life at Sea',
      'International Convention Safety Life Sea',
      'SOLAS 1974',
      'SOLAS 2020',
      'SOLAS Consolidated',
      'Maritime Safety Convention'
    ];
    
    const query = searchTerms.join(' OR ');
    return this.searchBooks(query, 20);
  }

  async searchMARPOL(): Promise<OpenLibrarySearchResponse> {
    const searchTerms = [
      'MARPOL Convention',
      'International Convention Prevention Pollution Ships',
      'MARPOL 73/78',
      'Marine Pollution Prevention',
      'MARPOL Annex'
    ];
    
    const query = searchTerms.join(' OR ');
    return this.searchBooks(query, 20);
  }

  async searchMaritimeRegulations(): Promise<OpenLibrarySearchResponse> {
    const searchTerms = [
      'maritime regulations',
      'IMO conventions',
      'international maritime law',
      'ship safety regulations',
      'marine pollution prevention',
      'maritime security',
      'COLREG',
      'collision regulations'
    ];
    
    const query = searchTerms.join(' OR ');
    return this.searchBooks(query, 50);
  }

  getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }

  getReadUrl(iaId: string): string {
    return `https://archive.org/details/${iaId}`;
  }

  getBookUrl(key: string): string {
    return `${this.BASE_URL}${key}`;
  }

  async downloadBook(iaId: string, format: 'pdf' | 'epub' | 'txt' = 'pdf'): Promise<string> {
    return `https://archive.org/download/${iaId}/${iaId}.${format}`;
  }
}

export const openLibraryAPI = new OpenLibraryAPIService();
export type { OpenLibrarySearchResponse, OpenLibraryDoc, OpenLibraryBook };
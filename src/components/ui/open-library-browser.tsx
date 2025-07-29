import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Book, Download, ExternalLink, Search, BookOpen, Scale, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { openLibraryAPI, OpenLibraryDoc, OpenLibrarySearchResponse } from "@/services/openLibraryAPI";

interface OpenLibraryBrowserProps {
  className?: string;
}

export const OpenLibraryBrowser = ({ className = "" }: OpenLibraryBrowserProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<OpenLibraryDoc[]>([]);
  const [solasDocs, setSolasDocs] = useState<OpenLibraryDoc[]>([]);
  const [marpolDocs, setMarpolDocs] = useState<OpenLibraryDoc[]>([]);
  const [maritimeDocs, setMaritimeDocs] = useState<OpenLibraryDoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("solas");
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [solasResults, marpolResults, maritimeResults] = await Promise.all([
        openLibraryAPI.searchSOLAS(),
        openLibraryAPI.searchMARPOL(),
        openLibraryAPI.searchMaritimeRegulations()
      ]);

      setSolasDocs(solasResults.docs);
      setMarpolDocs(marpolResults.docs);
      setMaritimeDocs(maritimeResults.docs);

      toast({
        title: "Belgeler Yüklendi",
        description: `${solasResults.docs.length} SOLAS, ${marpolResults.docs.length} MARPOL, ${maritimeResults.docs.length} denizcilik belgesi bulundu`,
      });
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Hata",
        description: "Belgeler yüklenirken hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await openLibraryAPI.searchBooks(searchQuery + " maritime OR shipping OR marine OR naval", 20);
      setSearchResults(results.docs);
      
      toast({
        title: "Arama Tamamlandı",
        description: `${results.docs.length} belge bulundu`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Arama Hatası",
        description: "Arama yapılırken hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (doc: OpenLibraryDoc, format: 'pdf' | 'epub' | 'txt' = 'pdf') => {
    try {
      if (doc.ia && doc.ia.length > 0) {
        const downloadUrl = await openLibraryAPI.downloadBook(doc.ia[0], format);
        window.open(downloadUrl, '_blank');
        
        toast({
          title: "İndirme Başlatıldı",
          description: `${doc.title} ${format.toUpperCase()} formatında indiriliyor`,
        });
      } else {
        toast({
          title: "İndirme Mevcut Değil",
          description: "Bu belge için indirme linki bulunamadı",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "İndirme Hatası",
        description: "Belge indirilirken hata oluştu",
        variant: "destructive",
      });
    }
  };

  const openInNewTab = (doc: OpenLibraryDoc) => {
    if (doc.ia && doc.ia.length > 0) {
      window.open(openLibraryAPI.getReadUrl(doc.ia[0]), '_blank');
    } else {
      window.open(openLibraryAPI.getBookUrl(doc.key), '_blank');
    }
  };

  const DocumentCard = ({ doc }: { doc: OpenLibraryDoc }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold line-clamp-2 mb-2">
              {doc.title}
            </CardTitle>
            {doc.author_name && (
              <CardDescription className="text-sm text-gray-600">
                Yazar: {doc.author_name.join(", ")}
              </CardDescription>
            )}
          </div>
          {doc.cover_i && (
            <img
              src={openLibraryAPI.getCoverUrl(doc.cover_i, 'S')}
              alt={doc.title}
              className="w-12 h-16 object-cover rounded ml-3"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Metadata */}
          <div className="flex flex-wrap gap-2">
            {doc.first_publish_year && (
              <Badge variant="secondary" className="text-xs">
                {doc.first_publish_year}
              </Badge>
            )}
            {doc.language && doc.language.includes('eng') && (
              <Badge variant="outline" className="text-xs">
                İngilizce
              </Badge>
            )}
            {doc.has_fulltext && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                Tam Metin
              </Badge>
            )}
            {doc.public_scan_b && (
              <Badge variant="default" className="text-xs bg-blue-100 text-blue-700">
                Ücretsiz
              </Badge>
            )}
          </div>

          {/* Publishers */}
          {doc.publisher && doc.publisher.length > 0 && (
            <p className="text-xs text-gray-500">
              Yayıncı: {doc.publisher.slice(0, 2).join(", ")}
              {doc.publisher.length > 2 && " ..."}
            </p>
          )}

          {/* Edition count */}
          {doc.edition_count && doc.edition_count > 1 && (
            <p className="text-xs text-gray-500">
              {doc.edition_count} farklı baskı
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openInNewTab(doc)}
              className="flex-1"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Oku
            </Button>
            
            {doc.ia && doc.ia.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(doc, 'pdf')}
              >
                <Download className="h-3 w-3 mr-1" />
                PDF
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(openLibraryAPI.getBookUrl(doc.key), '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DocumentGrid = ({ documents }: { documents: OpenLibraryDoc[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc, index) => (
        <DocumentCard key={`${doc.key}-${index}`} doc={doc} />
      ))}
    </div>
  );

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Open Library - Denizcilik Belgeleri
        </CardTitle>
        <CardDescription>
          SOLAS, MARPOL ve diğer denizcilik belgeleri
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="flex gap-2">
          <Input
            placeholder="Belge ara... (örn: SOLAS, MARPOL, maritime law)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="solas" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              SOLAS
            </TabsTrigger>
            <TabsTrigger value="marpol" className="flex items-center gap-1">
              <Scale className="h-3 w-3" />
              MARPOL
            </TabsTrigger>
            <TabsTrigger value="maritime" className="flex items-center gap-1">
              <Book className="h-3 w-3" />
              Denizcilik
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              Arama
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solas" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">SOLAS Belgeleri</h3>
              <Badge variant="secondary">{solasDocs.length} belge</Badge>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <DocumentGrid documents={solasDocs} />
            )}
          </TabsContent>

          <TabsContent value="marpol" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">MARPOL Belgeleri</h3>
              <Badge variant="secondary">{marpolDocs.length} belge</Badge>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <DocumentGrid documents={marpolDocs} />
            )}
          </TabsContent>

          <TabsContent value="maritime" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Denizcilik Belgeleri</h3>
              <Badge variant="secondary">{maritimeDocs.length} belge</Badge>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <DocumentGrid documents={maritimeDocs} />
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Arama Sonuçları</h3>
              <Badge variant="secondary">{searchResults.length} belge</Badge>
            </div>
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Arama yapmak için yukarıdaki kutuyu kullanın
              </div>
            ) : (
              <DocumentGrid documents={searchResults} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
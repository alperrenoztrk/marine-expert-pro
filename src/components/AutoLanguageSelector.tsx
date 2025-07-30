import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Globe, Check, Loader2, Zap } from "lucide-react";
import { useAutoLanguageDetection } from "@/hooks/useAutoLanguageDetection";
import { SUPPORTED_LANGUAGES, getLanguageInfo } from "@/utils/microsoftTranslator";
import { toast } from "sonner";

export const AutoLanguageSelector = () => {
  const { 
    detectedLanguage, 
    currentLanguage, 
    setLanguage, 
    isTranslating,
    supportedLanguages 
  } = useAutoLanguageDetection();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showAutoDetectPrompt, setShowAutoDetectPrompt] = useState(false);

  const currentLangInfo = getLanguageInfo(currentLanguage);
  const detectedLangInfo = getLanguageInfo(detectedLanguage);

  // Otomatik dil algılama önerisi
  useEffect(() => {
    const timer = setTimeout(() => {
      if (detectedLanguage !== currentLanguage && detectedLanguage !== 'tr') {
        setShowAutoDetectPrompt(true);
      }
    }, 2000); // 2 saniye sonra öner

    return () => clearTimeout(timer);
  }, [detectedLanguage, currentLanguage]);

  const handleLanguageChange = async (langCode: string) => {
    try {
      await setLanguage(langCode);
      setIsOpen(false);
      setShowAutoDetectPrompt(false);
      
      const langInfo = getLanguageInfo(langCode);
      toast.success(`${langInfo.flag} ${langInfo.name} diline geçildi!`);
    } catch (error) {
      toast.error("Dil değiştirilirken hata oluştu");
    }
  };

  const handleAutoDetect = async () => {
    await handleLanguageChange(detectedLanguage);
  };

  return (
    <div className="relative">
      {/* Otomatik Algılama Önerisi */}
      {showAutoDetectPrompt && detectedLanguage !== currentLanguage && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg shadow-lg border max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Otomatik Dil Algılandı!</span>
          </div>
          <p className="text-xs mb-3">
            {detectedLangInfo.flag} {detectedLangInfo.name} diline geçmek ister misiniz?
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAutoDetect}
              className="h-6 px-2 text-xs"
            >
              Evet
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAutoDetectPrompt(false)}
              className="h-6 px-2 text-xs text-white hover:bg-white/20"
            >
              Hayır
            </Button>
          </div>
        </div>
      )}

      {/* Dil Seçici */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 min-w-[120px] relative"
            disabled={isTranslating}
          >
            {isTranslating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            <span className="hidden xs:inline">
              {currentLangInfo.flag} {currentLangInfo.name}
            </span>
            <span className="xs:hidden">{currentLangInfo.flag}</span>
            
            {/* Otomatik algılama göstergesi */}
            {detectedLanguage !== currentLanguage && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-64 max-h-80 overflow-y-auto"
        >
          {/* Otomatik Algılanan Dil (Eğer farklıysa) */}
          {detectedLanguage !== currentLanguage && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                🤖 Otomatik Algılanan
              </div>
              <DropdownMenuItem
                onClick={() => handleLanguageChange(detectedLanguage)}
                className="flex items-center justify-between cursor-pointer bg-blue-50 hover:bg-blue-100"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span>{detectedLangInfo.flag}</span>
                  <span className="text-sm font-medium">{detectedLangInfo.name}</span>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400">Önerilen</span>
              </DropdownMenuItem>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                🌍 Tüm Diller
              </div>
            </>
          )}

          {/* Tüm Desteklenen Diller */}
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => handleLanguageChange(code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>{info.flag}</span>
                <span className="text-sm">{info.name}</span>
              </div>
              {currentLanguage === code && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
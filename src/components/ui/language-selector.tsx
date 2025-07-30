import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Languages, 
  Globe, 
  Loader2, 
  Check, 
  Zap,
  Sparkles
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageSelectorProps {
  variant?: "default" | "compact" | "floating";
  showLabel?: boolean;
  className?: string;
}

export const LanguageSelector = ({ 
  variant = "default", 
  showLabel = true,
  className = ""
}: LanguageSelectorProps) => {
  const {
    currentLanguage,
    supportedLanguages,
    isLoading,
    isTranslating,
    changeLanguage,
    autoDetectLanguage,
    getLanguageName,
    resetLanguagePreferences
  } = useLanguage();

  const [isDetecting, setIsDetecting] = useState(false);

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    try {
      await autoDetectLanguage();
    } finally {
      setIsDetecting(false);
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    if (currentLanguage === languageCode) return;
    
    console.log(`Changing language from ${currentLanguage} to ${languageCode}`);
    await changeLanguage(languageCode);
  };

  const getLanguageFlag = (code: string): string => {
    const flags: Record<string, string> = {
      'en': '🇺🇸',
      'tr': '🇹🇷',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇵🇹',
      'ru': '🇷🇺',
      'ja': '🇯🇵',
      'ko': '🇰🇷',
      'zh': '🇨🇳',
      'ar': '🇸🇦'
    };
    return flags[code] || '🌐';
  };

  // Compact variant for mobile/tight spaces
  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${className} h-8 w-8 p-0`}
            disabled={isLoading}
          >
            {isLoading || isTranslating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="text-lg">{getLanguageFlag(currentLanguage)}</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            Dil Seçin
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {supportedLanguages.slice(0, 12).map((lang) => (
            <DropdownMenuItem
              key={lang.language}
              onClick={() => handleLanguageChange(lang.language)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{getLanguageFlag(lang.language)}</span>
                <span>{lang.displayName || getLanguageName(lang.language)}</span>
              </div>
              {currentLanguage === lang.language && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Floating variant for corner positioning
  if (variant === "floating") {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="default" 
              size="sm"
              className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading || isTranslating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <>
                  <span className="text-lg mr-2">{getLanguageFlag(currentLanguage)}</span>
                  <Languages className="h-4 w-4" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 mb-2">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Dil Değiştir
              <Badge variant="secondary" className="ml-auto">
                Google Translate
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
                         {/* Auto Detect Option */}
             <DropdownMenuItem
               onClick={handleAutoDetect}
               className="flex items-center gap-2 font-medium"
               disabled={isDetecting}
             >
               {isDetecting ? (
                 <Loader2 className="h-4 w-4 animate-spin" />
               ) : (
                 <Zap className="h-4 w-4 text-blue-500" />
               )}
               Otomatik Algıla
             </DropdownMenuItem>
             
             {/* Reset Option */}
             <DropdownMenuItem
               onClick={resetLanguagePreferences}
               className="flex items-center gap-2 font-medium text-orange-600"
             >
               <span className="text-orange-500">↻</span>
               Dil Ayarlarını Sıfırla
             </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {supportedLanguages.slice(0, 12).map((lang) => (
              <DropdownMenuItem
                key={lang.language}
                onClick={() => handleLanguageChange(lang.language)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>{getLanguageFlag(lang.language)}</span>
                  <span>{lang.displayName || getLanguageName(lang.language)}</span>
                </div>
                {currentLanguage === lang.language && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`${className} flex items-center gap-2`}
          disabled={isLoading}
        >
          {isLoading || isTranslating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span className="text-lg">{getLanguageFlag(currentLanguage)}</span>
              <Languages className="h-4 w-4" />
              {showLabel && (
                <span className="hidden sm:inline">
                  {getLanguageName(currentLanguage)}
                </span>
              )}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Dil Değiştir
          <Badge variant="secondary" className="ml-auto flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Google Translate
          </Badge>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Current Language Display */}
        <div className="px-2 py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Şu anki dil:</span>
            <div className="flex items-center gap-1">
              <span>{getLanguageFlag(currentLanguage)}</span>
              <span className="font-medium">{getLanguageName(currentLanguage)}</span>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Auto Detect Option */}
        <DropdownMenuItem
          onClick={handleAutoDetect}
          className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400"
          disabled={isDetecting}
        >
          {isDetecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          <div className="flex flex-col">
            <span>Otomatik Algıla</span>
            <span className="text-xs text-muted-foreground">
              Tarayıcı dilini algıla
            </span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Language Options */}
        <div className="max-h-64 overflow-y-auto">
          {supportedLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.language}
              onClick={() => handleLanguageChange(lang.language)}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{getLanguageFlag(lang.language)}</span>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {lang.displayName || getLanguageName(lang.language)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {lang.name}
                  </span>
                </div>
              </div>
              {currentLanguage === lang.language && (
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  <Badge variant="default">
                    Aktif
                  </Badge>
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Footer */}
        <div className="px-2 py-2 text-xs text-muted-foreground text-center">
          <div className="flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>Google Translate API ile desteklenmektedir</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
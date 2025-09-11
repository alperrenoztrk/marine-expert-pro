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
  Check
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
    changeLanguage,
    getLanguageName
  } = useLanguage();

  const handleLanguageChange = (languageCode: string) => {
    if (currentLanguage === languageCode) return;
    changeLanguage(languageCode);
  };

  const getLanguageFlag = (code: string): string => {
    const flags: Record<string, string> = {
      'en': '🇺🇸',
      'tr': '🇹🇷',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪'
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
          >
            <span className="text-lg">{getLanguageFlag(currentLanguage)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            Dil Seçin
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {supportedLanguages.map((lang) => (
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

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`${className} flex items-center gap-2`}
        >
          <>
            <span className="text-lg">{getLanguageFlag(currentLanguage)}</span>
            <Languages className="h-4 w-4" />
            {showLabel && (
              <span className="hidden sm:inline">
                {getLanguageName(currentLanguage)}
              </span>
            )}
          </>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Dil Değiştir
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
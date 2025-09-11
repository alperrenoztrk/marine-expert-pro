import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Code, 
  Trash2, 
  RefreshCw, 
  Info,
  CheckCircle
} from "lucide-react";

export const LanguageDebug = () => {
  const { currentLanguage, resetLanguagePreferences, changeLanguage } = useLanguage();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    updateDebugInfo();
  }, [currentLanguage]);

  const updateDebugInfo = () => {
    const info = {
      currentLanguage,
      preferredLanguage: localStorage.getItem('preferredLanguage'),
      browserLanguage: navigator.language,
      detectedLanguage: navigator.language.split('-')[0]
    };
    setDebugInfo(info);
  };

  const forceLanguageChange = (langCode: string) => {
    localStorage.setItem('preferredLanguage', langCode);
    changeLanguage(langCode);
  };

  // Show debug panel only in development or when ?debug=true
  const showDebug = import.meta.env.DEV || new URLSearchParams(window.location.search).get('debug') === 'true';

  if (!showDebug && !isVisible) return null;

  return (
    <div className="fixed top-4 left-4 z-50 max-w-md">
      {!isVisible ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
        >
          <Code className="h-4 w-4 mr-1" />
          Dil Debug
        </Button>
      ) : (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Code className="h-4 w-4" />
                Dil Debug Panel
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <CardDescription className="text-xs">
              Dil ayarları durumu
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3 text-xs">
            {/* Current Status */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Mevcut Durum
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Aktif Dil:</span>
                  <Badge variant="default" className="text-xs">
                    {debugInfo.currentLanguage}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>localStorage:</span>
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
              </div>
            </div>

            {/* Storage Info */}
            <div>
              <h4 className="font-medium mb-2">localStorage</h4>
              <div className="space-y-1 text-xs font-mono bg-gray-100 p-2 rounded">
                <div>preferred: {debugInfo.preferredLanguage || 'null'}</div>
                <div>browser: {debugInfo.browserLanguage}</div>
                <div>detected: {debugInfo.detectedLanguage}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="font-medium mb-2">Hızlı İşlemler</h4>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => forceLanguageChange('en')}
                  className="text-xs h-7"
                >
                  🇺🇸 EN
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => forceLanguageChange('tr')}
                  className="text-xs h-7"
                >
                  🇹🇷 TR
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => forceLanguageChange('es')}
                  className="text-xs h-7"
                >
                  🇪🇸 ES
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => forceLanguageChange('fr')}
                  className="text-xs h-7"
                >
                  🇫🇷 FR
                </Button>
              </div>
            </div>

            {/* Reset Actions */}
            <div className="space-y-1">
              <Button
                variant="outline"
                size="sm"
                onClick={resetLanguagePreferences}
                className="w-full text-xs h-7"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Ayarları Sıfırla
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center pt-2 border-t">
              Debug panel - sadece geliştirme için
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
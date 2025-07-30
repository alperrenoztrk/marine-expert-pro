import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Globe, Settings as SettingsIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { useAutoLanguageDetection } from "@/hooks/useAutoLanguageDetection";
import { languages } from "@/utils/languages";
import { toast } from "sonner";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { currentLanguage, setCurrentLanguage } = useAutoLanguageDetection();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const handleThemeToggle = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    setIsDarkMode(checked);
    toast.success(checked ? "Koyu tema aktif" : "Açık tema aktif");
  };

  const handleLanguageChange = (value: string) => {
    setCurrentLanguage(value);
    toast.success(`Dil değiştirildi: ${languages.find(lang => lang.code === value)?.name}`);
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Back Button */}
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50 dark:hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4" />
                <span data-translatable>Ana Sayfa</span>
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <SettingsIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <span data-translatable>Ayarlar</span>
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              <span data-translatable>Uygulama tercihlerinizi özelleştirin</span>
            </p>
          </div>

          {/* Settings Cards */}
          <div className="grid gap-6">
            
            {/* Theme Settings */}
            <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span data-translatable>Tema Ayarları</span>
                </CardTitle>
                <CardDescription>
                  <span data-translatable>Arayüz temasını seçin</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode" className="text-base">
                      <span data-translatable>Koyu Tema</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      <span data-translatable>Göz yorgunluğunu azaltır</span>
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={handleThemeToggle}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span data-translatable>Dil Ayarları</span>
                </CardTitle>
                <CardDescription>
                  <span data-translatable>Uygulama dilini seçin</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language-select">
                      <span data-translatable>Dil</span>
                    </Label>
                    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                      <SelectTrigger id="language-select">
                        <SelectValue placeholder="Dil seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{lang.flag}</span>
                              <span>{lang.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span data-translatable>Seçilen dil tüm uygulamada geçerli olacaktır</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle>
                  <span data-translatable>Hakkında</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground" data-translatable>Versiyon</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground" data-translatable>Geliştirici</span>
                  <span className="font-medium">Maritime Calculator Team</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <span data-translatable>Bu uygulama denizcilik hesaplamaları için geliştirilmiştir</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </MobileLayout>
  );
};

export default Settings;
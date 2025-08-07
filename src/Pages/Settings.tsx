import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Globe, Settings as SettingsIcon, Palette, Zap, Volume2, VolumeX } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLanguageFlag } from "@/utils/languages";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { currentLanguage, changeLanguage, supportedLanguages, getLanguageName } = useLanguage();
  const [neonSoundEnabled, setNeonSoundEnabled] = useState(true);

  useEffect(() => {
    const savedSoundSetting = localStorage.getItem('neonSoundEnabled');
    if (savedSoundSetting !== null) {
      setNeonSoundEnabled(JSON.parse(savedSoundSetting));
    }
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as "light" | "dark" | "cyberpunk" | "neon" | "nature");
    
    const themeNames = {
      light: "Açık Tema",
      dark: "Koyu Tema", 
      cyberpunk: "Cyberpunk Tema",
      neon: "Neon Tema",
      nature: "Doğa Teması",
      
    };
    
    toast.success(`${themeNames[newTheme as keyof typeof themeNames]} aktif`);
  };

  const handleLanguageChange = async (value: string) => {
    await changeLanguage(value);
    toast.success(`Dil değiştirildi: ${getLanguageName(value)}`);
  };

  const handleNeonSoundToggle = (enabled: boolean) => {
    setNeonSoundEnabled(enabled);
    localStorage.setItem('neonSoundEnabled', JSON.stringify(enabled));
    toast.success(enabled ? 'Neon ses efektleri aktif' : 'Neon ses efektleri devre dışı');
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 cyberpunk:from-black cyberpunk:to-gray-900 neon:from-slate-900 neon:to-slate-800 nature:from-green-50 nature:to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Back Button */}
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-50 dark:hover:bg-gray-700 cyberpunk:hover:bg-gray-800 neon:hover:bg-slate-800 nature:hover:bg-green-50">
                <ArrowLeft className="w-4 h-4" />
                <span data-translatable>Ana Sayfa</span>
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <SettingsIcon className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
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
                  <Palette className="w-5 h-5" />
                  <span data-translatable>Tema Ayarları</span>
                </CardTitle>
                <CardDescription>
                  <span data-translatable>Uygulama tema rengini seçin</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme-select">
                      <span data-translatable>Tema</span>
                    </Label>
                    <Select value={theme} onValueChange={handleThemeChange}>
                      <SelectTrigger id="theme-select">
                        <SelectValue placeholder="Tema seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="w-5 h-5" />
                            <span data-translatable>Açık Tema</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="w-5 h-5" />
                            <span data-translatable>Koyu Tema</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="cyberpunk">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            <span data-translatable>Cyberpunk Tema</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="neon">
                          <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            <span data-translatable>Neon Tema</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="nature">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-5 h-5" />
                            <span data-translatable>Doğa Teması</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span data-translatable>Seçilen tema tüm uygulamada geçerli olacaktır</span>
                  </p>
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
                        {supportedLanguages.map((lang) => (
                          <SelectItem key={lang.language} value={lang.language}>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getLanguageFlag(lang.language)}</span>
                              <span>{lang.displayName || getLanguageName(lang.language)}</span>
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

            {/* Neon Sound Settings */}
            <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  <span data-translatable>Neon Ses Efektleri</span>
                </CardTitle>
                <CardDescription>
                  <span data-translatable>Neon efektlerinin sesini açık veya kapatın</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span data-translatable>Neon Ses Efektleri</span>
                  <Switch
                    id="neon-sound"
                    checked={neonSoundEnabled}
                    onCheckedChange={handleNeonSoundToggle}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  <span data-translatable>Seçilen ayar tüm uygulamada geçerli olacaktır</span>
                </p>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  <span data-translatable>Hakkında</span>
                </CardTitle>
                <CardDescription>
                  <span data-translatable>Uygulama hakkında bilgi alın</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p data-translatable>
                  Bu uygulama, modern ve kullanıcı dostu bir arayüzle birlikte gelir.
                  Mobil cihazlarınızda kullanılabilir ve güvenli bir deneyim sunar.
                </p>
                <Separator className="my-4" />
                <p data-translatable>
                  Versiyon: 1.0.0
                </p>
                <p data-translatable>
                  Geliştirici: Your Name
                </p>
                <p data-translatable>
                  İletişim: your.email@example.com
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </MobileLayout>
  );
};

export default Settings;
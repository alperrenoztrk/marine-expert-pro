import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Globe, Settings2 as SettingsIcon, Palette, CreditCard, Minimize2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { useDensity } from "@/contexts/DensityContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLanguageFlag } from "@/utils/languages";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { density, setDensity, toggleDensity } = useDensity();
  const { currentLanguage, changeLanguage, supportedLanguages, getLanguageName } = useLanguage();
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as "light" | "dark");
    const themeNames = { light: "Açık Tema", dark: "Koyu Tema" } as const;
    toast.success(`${themeNames[newTheme as keyof typeof themeNames]} aktif`);
  };

  const handleLanguageChange = async (value: string) => {
    await changeLanguage(value);
    toast.success(`Dil değiştirildi: ${getLanguageName(value)}`);
  };

  

  const handleStartCheckout = async () => {
    try {
      setIsProcessingPayment(true);
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          // priceId: 'price_XXXX', // Supabase Edge env'de STRIPE_DEFAULT_PRICE_ID de kullanılabilir
          mode: 'payment',
          successUrl: window.location.origin + '/?payment=success',
          cancelUrl: window.location.origin + '/settings?payment=cancel',
        },
      });
      if (error) throw error;
      const url = (data as any)?.url;
      if (!url) {
        toast.error('Stripe checkout URL oluşturulamadı');
        return;
      }
      window.location.href = url as string;
    } catch (e: any) {
      console.error(e);
      toast.error('Ödeme başlatılamadı');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Back Button */}
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-50 dark:hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4" />
                <span data-translatable>Ana Sayfa</span>
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <SettingsIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
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
                  <span data-translatable>Arayüz temasını seçin</span>
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
                            <Sun className="w-4 h-4" />
                            <span>Açık Tema</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            <span>Koyu Tema</span>
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

            {/* Density Settings */}
            <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Minimize2 className="w-5 h-5" />
                  <span data-translatable>Yoğunluk (Sıkı/Komforlu)</span>
                </CardTitle>
                <CardDescription>
                  <span data-translatable>Arayüz öğelerinin dikey boşluklarını ayarlayın</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="density-toggle">
                      <span data-translatable>Arayüz Yoğunluğu</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {density === 'compact' ? 'Kompakt mod aktif' : 'Konforlu mod aktif'}
                    </p>
                  </div>
                  <Button id="density-toggle" variant="outline" onClick={toggleDensity}>
                    {density === 'compact' ? 'Konforlu' : 'Kompakt'}
                  </Button>
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

            {/* Payment / Stripe */}
            <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span data-translatable>Ödeme</span>
                </CardTitle>
                <CardDescription>
                  <span data-translatable>Pro özellikler için ödeme yapın</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>
                      <span data-translatable>Stripe Checkout</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      <span data-translatable>Güvenli ödeme ile hemen yükseltin</span>
                    </p>
                  </div>
                  <Button onClick={handleStartCheckout} disabled={isProcessingPayment}>
                    {isProcessingPayment ? (
                      <span data-translatable>Yönlendiriliyor...</span>
                    ) : (
                      <span data-translatable>Satın Al</span>
                    )}
                  </Button>
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
import { useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Building, Calculator } from "lucide-react";
import { TrimCalculations } from "@/components/calculations/TrimCalculations";
import { AutoLanguageSelector } from "@/components/AutoLanguageSelector";
import { GoogleAuth } from "@/components/auth/GoogleAuth";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "sonner";
import React from "react";

const TrimList = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const safeUserData = (() => {
    try {
      return useUserData(currentUser?.id);
    } catch (error) {
      console.warn('UserData hook failed, using fallback:', error);
      return {
        saveCalculation: () => Promise.resolve()
      };
    }
  })();

  const { saveCalculation } = safeUserData;

  const handleCalculationComplete = async (calculationType: string, inputData: any, resultData: any) => {
    if (currentUser?.id) {
      try {
        await saveCalculation(calculationType, inputData, resultData);
        toast.success("Hesaplama kaydedildi!");
      } catch (error) {
        console.warn('Failed to save calculation:', error);
      }
    }
  };

  return (
    <MobileLayout>
      {/* Header Section */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-teal-600/20 rounded-xl"></div>
        
        <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-blue-200/50 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span data-translatable>Ana Sayfa</span>
                </Button>
              </Link>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900" data-translatable>
                  Trim ve List Hesaplamaları
                </h1>
                <p className="text-sm text-muted-foreground" data-translatable>
                  Gemi duruşu, trim açısı ve list düzeltme hesaplamaları
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <AutoLanguageSelector />
              <GoogleAuth onAuthChange={setCurrentUser} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span data-translatable>
                IMO Load Line Convention ve SOLAS standartlarına uygun trim ve list hesaplamaları
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-6 w-6" />
              <span data-translatable>Trim ve List Hesaplama Merkezi</span>
            </CardTitle>
            <CardDescription data-translatable>
              Gemi duruşu analizi, yük dağılımı optimizasyonu ve stabilite kontrolleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">Trim</div>
                <div className="text-sm text-muted-foreground" data-translatable>
                  Baş-Kıç Duruşu
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">List</div>
                <div className="text-sm text-muted-foreground" data-translatable>
                  Sancak-İskele Duruşu
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">Stabilite</div>
                <div className="text-sm text-muted-foreground" data-translatable>
                  Genel Denge
                </div>
              </div>
            </div>

            <React.Suspense 
              fallback={
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2" data-translatable>Hesaplama modülü yükleniyor...</span>
                </div>
              }
            >
              <TrimCalculations onCalculationComplete={handleCalculationComplete} />
            </React.Suspense>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle data-translatable>Trim ve List Hakkında</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2" data-translatable>Trim Nedir?</h4>
                  <p className="text-sm text-muted-foreground" data-translatable>
                    Trim, geminin baş ve kıç draft'ları arasındaki farktır. Pozitif trim kıça doğru 
                    eğilimi (trim by stern), negatif trim başa doğru eğilimi (trim by head) gösterir.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" data-translatable>List Nedir?</h4>
                  <p className="text-sm text-muted-foreground" data-translatable>
                    List, geminin sancak ve iskele tarafları arasındaki draft farkıdır. 
                    Yük dağılımının eşit olmaması durumunda oluşur.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" data-translatable>Neden Önemli?</h4>
                  <p className="text-sm text-muted-foreground" data-translatable>
                    Uygun trim ve list değerleri yakıt verimliliğini artırır, manevra kabiliyetini 
                    iyileştirir ve geminin güvenli operasyonunu sağlar.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" data-translatable>Regülasyonlar</h4>
                  <p className="text-sm text-muted-foreground" data-translatable>
                    IMO Load Line Convention ve SOLAS kurallarına göre trim değerleri 
                    belirli limitler içinde tutulmalıdır.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default TrimList;
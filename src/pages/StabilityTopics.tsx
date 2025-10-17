import React from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function StabilityTopicsPage() {
  return (
    <div key="stability-topics-v1" className="relative min-h-screen overflow-hidden" data-no-translate>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-dark via-primary to-primary-light" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link to="/stability">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 drop-shadow-sm">Stabilite Konu Anlatımı</h1>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/30 p-6 bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-blue-700" />
              <div className="text-xl font-semibold text-blue-700">Temel Başlıklar</div>
            </div>
            <ul className="list-disc pl-6 text-sm leading-7">
              <li>GM, KM, KG ve BM kavramları</li>
              <li>GZ eğrisi ve dinamik stabilite</li>
              <li>Serbest yüzey düzeltmesi (FSC)</li>
              <li>Trim ve ağırlık kaydırma etkileri</li>
              <li>Yaralı (hasarlı) stabiliteye giriş</li>
            </ul>
            <div className="mt-4 text-xs text-white/80">
              Bu sayfa iskelet olarak eklendi. Gerekirse mevcut ders içerikleriyle genişletilecektir.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Zap, Shield } from "lucide-react";

interface NativeAdProps {
  className?: string;
}

export const NativeAd = ({ className = "" }: NativeAdProps) => {
  // Sponsorlu maritime ürünleri/servisleri
  const sponsoredContent = {
    title: "Professional Maritime Tools",
    description: "Professional ship design and stability analysis software used by leading shipyards worldwide.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    badge: "Sponsored",
    cta: "Learn More",
    rating: 4.8,
    features: ["SOLAS Compliance", "Real-time Analysis", "Global Standards"],
    company: "NaviTech Marine"
  };

  const handleAdClick = () => {
    // Reklam tıklama analitiklerini kaydet
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ad_click', {
        event_category: 'advertisement',
        event_label: 'native_ad_maritime_software',
        value: 1
      });
    }
    
    // Reklam sayfasına yönlendir (gerçek projede sponsor linki olacak)
    window.open('https://example-maritime-software.com', '_blank');
  };

  return (
    <Card className={`${className} hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {sponsoredContent.badge}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">{sponsoredContent.rating}</span>
          </div>
        </div>
        <CardTitle className="text-lg">{sponsoredContent.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Görsel */}
        <div className="relative overflow-hidden rounded-lg">
          <img 
            src={sponsoredContent.image}
            alt={sponsoredContent.title}
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Açıklama */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {sponsoredContent.description}
        </p>

        {/* Özellikler */}
        <div className="flex flex-wrap gap-2">
          {sponsoredContent.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-1 text-xs bg-muted/50 px-2 py-1 rounded">
              {index === 0 && <Shield className="w-3 h-3" />}
              {index === 1 && <Zap className="w-3 h-3" />}
              {index === 2 && <Star className="w-3 h-3" />}
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button 
          onClick={handleAdClick}
          className="w-full gap-2 text-sm"
          variant="outline"
        >
          <ExternalLink className="w-4 h-4" />
          {sponsoredContent.cta}
        </Button>

        {/* Şirket bilgisi */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          by {sponsoredContent.company} • Maritime Industry Partner
        </div>
      </CardContent>
    </Card>
  );
};

// Maritime sektörüne özel sponsorlu içerikler
export const MaritimeEquipmentAd = () => (
  <Card className="border-l-4 border-l-green-500">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">Equipment</Badge>
        <Badge variant="outline" className="text-xs text-green-700">New Tech</Badge>
      </div>
      <CardTitle className="text-lg">Maritime Navigation Systems</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">
        Latest navigation systems, marine engines, and safety equipment from leading manufacturers worldwide.
      </p>
      <Button className="w-full gap-2" variant="outline">
        <ExternalLink className="w-4 h-4" />
        Explore Products
      </Button>
    </CardContent>
  </Card>
);

export const MaritimeSoftwareAd = () => (
  <Card className="border-l-4 border-l-purple-500">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">Software</Badge>
        <Badge variant="outline" className="text-xs text-purple-600">Free Trial</Badge>
      </div>
      <CardTitle className="text-lg">Maritime Design Systems</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">
        Advanced ship design and naval architecture software trusted by leading maritime companies worldwide.
      </p>
      <Button className="w-full gap-2" variant="outline">
        <ExternalLink className="w-4 h-4" />
        Try Free
      </Button>
    </CardContent>
  </Card>
);
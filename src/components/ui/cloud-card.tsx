import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CloudType } from "@/components/calculations/cloud-types";
import { 
  Cloud, 
  Eye, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  Info,
  Navigation,
  Thermometer
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CloudCardProps {
  cloud: CloudType;
  className?: string;
}

export function CloudCard({ cloud, className }: CloudCardProps) {
  const getDangerColor = (danger: string) => {
    switch (danger) {
      case 'high':
        return 'border-red-500 bg-red-50 neon:border-cyan-400 neon:bg-cyan-900/30';
      case 'medium':
        return 'border-orange-400 bg-orange-50 neon:border-cyan-400 neon:bg-cyan-900/30';
      case 'low':
        return 'border-blue-300 bg-blue-50 cyberpunk:border-yellow-400 cyberpunk:bg-gray-800 neon:border-cyan-400 neon:bg-cyan-900/30';
      default:
        return 'border-gray-300 bg-gray-50 neon:border-cyan-400 neon:bg-cyan-900/30';
    }
  };

  const getDangerBadge = (danger: string) => {
    switch (danger) {
      case 'high':
        return <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Yüksek Risk
        </Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-orange-500 text-orange-700 gap-1">
          <Info className="h-3 w-3" />
          Orta Risk
        </Badge>;
      case 'low':
        return <Badge variant="secondary" className="gap-1">
          <Info className="h-3 w-3" />
          Düşük Risk
        </Badge>;
      default:
        return null;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-blue-100 text-blue-800 cyberpunk:bg-gray-800 cyberpunk:text-yellow-400 neon:bg-cyan-900/50 neon:text-cyan-400';
      case 'middle':
        return 'bg-green-100 text-green-800 neon:bg-cyan-900/50 neon:text-cyan-400';
      case 'high':
        return 'bg-purple-100 text-purple-800 neon:bg-cyan-900/50 neon:text-cyan-400';
      case 'vertical':
        return 'bg-red-100 text-red-800 neon:bg-cyan-900/50 neon:text-cyan-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 neon:bg-cyan-900/50 neon:text-cyan-400';
    }
  };

  return (
    <Card className={cn(getDangerColor(cloud.danger), "transition-all hover:shadow-lg dark:shadow-gray-900/50", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cloud className="h-5 w-5" />
              {cloud.name} ({cloud.code})
            </CardTitle>
            <CardDescription className="text-base font-medium mt-1">
              {cloud.nameTr}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getDangerBadge(cloud.danger)}
            <Badge className={cn("text-xs", getLevelColor(cloud.level))}>
              {cloud.mgmCode}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Görsel */}
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {cloud.imageUrl ? (
            <img 
              src={cloud.imageUrl} 
              alt={`${cloud.name} - ${cloud.descriptionTr}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`${cloud.imageUrl ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-br from-sky-100 to-sky-200 items-center justify-center`}
          >
            <div className="text-center">
              <Cloud className="h-16 w-16 text-sky-600 mb-2" />
              <div className="text-lg font-bold text-sky-800">{cloud.code}</div>
              <div className="text-sm text-sky-700">{cloud.nameTr}</div>
            </div>
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs backdrop-blur-sm">
              <Thermometer className="h-3 w-3 mr-1" />
              {cloud.altitude}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs backdrop-blur-sm">
              {cloud.altitudeFt}
            </Badge>
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge className={cn("text-xs font-bold backdrop-blur-sm", getLevelColor(cloud.level))}>
              {cloud.code}
            </Badge>
          </div>
        </div>

        {/* Açıklama */}
        <div className="space-y-2">
          <p className="text-sm text-gray-700 dark:text-gray-300 neon:text-cyan-300">{cloud.descriptionTr}</p>
          
          {/* Özellikler */}
          <div className="bg-white dark:bg-gray-800/50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2 neon:bg-cyan-900/30">
            <h4 className="font-semibold text-sm flex items-center gap-1 neon:text-cyan-400">
              <Info className="h-4 w-4" />
              Özellikler
            </h4>
            <ul className="text-xs space-y-1">
              {cloud.characteristics.map((char, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-gray-400 mt-0.5 neon:text-cyan-500">•</span>
                  <span className="neon:text-cyan-300">{char}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Denizcilik Önemi */}
        <Alert className={cn(
          "border",
          cloud.danger === 'high' ? 'border-red-300 bg-red-50' :
          cloud.danger === 'medium' ? 'border-orange-300 bg-orange-50' :
          'border-blue-300 bg-blue-50 cyberpunk:border-yellow-400 cyberpunk:bg-gray-800',
          'neon:border-cyan-400 neon:bg-cyan-900/30'
        )}>
          <Navigation className="h-4 w-4" />
          <AlertDescription className="text-sm neon:text-cyan-300">
            <span className="font-semibold neon:text-cyan-400">Denizcilik Önemi:</span> {cloud.maritimeImportance}
          </AlertDescription>
        </Alert>

        {/* Detaylı Bilgiler */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-white dark:bg-gray-800/50 dark:bg-gray-700/50 rounded p-2 text-center neon:bg-cyan-900/30">
            <Eye className="h-4 w-4 mx-auto mb-1 text-gray-600 dark:text-gray-400 neon:text-cyan-400" />
            <div className="font-semibold neon:text-cyan-400">Görüş</div>
            <div className="text-gray-700 dark:text-gray-300 neon:text-cyan-300">{cloud.visibility}</div>
          </div>
          <div className="bg-white dark:bg-gray-800/50 dark:bg-gray-700/50 rounded p-2 text-center neon:bg-cyan-900/30">
            <Wind className="h-4 w-4 mx-auto mb-1 text-gray-600 dark:text-gray-400 neon:text-cyan-400" />
            <div className="font-semibold neon:text-cyan-400">Rüzgar</div>
            <div className="text-gray-700 dark:text-gray-300 neon:text-cyan-300">{cloud.wind}</div>
          </div>
          <div className="bg-white dark:bg-gray-800/50 dark:bg-gray-700/50 rounded p-2 text-center neon:bg-cyan-900/30">
            <Droplets className="h-4 w-4 mx-auto mb-1 text-gray-600 dark:text-gray-400 neon:text-cyan-400" />
            <div className="font-semibold neon:text-cyan-400">Yağış</div>
            <div className="text-gray-700 dark:text-gray-300 neon:text-cyan-300">{cloud.precipitation}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Sunrise, Sunset, Clock } from "lucide-react";

interface TimeWidgetsProps {
  trtTime: string;
  gmtTime: string;
  lmtTime: string;
  ztTime: string;
  sunriseTime: string;
  sunsetTime: string;
}

const TimeWidgets: React.FC<TimeWidgetsProps> = ({
  trtTime,
  gmtTime,
  lmtTime,
  ztTime,
  sunriseTime,
  sunsetTime,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6" data-widget-container>
      {/* Main Digital Clock - TRT */}
      <Card className="glass-widget glass-widget-hover relative overflow-hidden rounded-2xl p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-primary animate-pulse" />
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Türkiye Saati
            </div>
          </div>
          <div className="font-mono text-6xl md:text-7xl font-bold tracking-widest text-foreground animate-neon-glow">
            {trtTime}
          </div>
          <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
        </div>
      </Card>

      {/* Other Time Zones - Compact Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass-widget glass-widget-hover rounded-xl p-3 shadow-lg">
          <div className="text-center space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase">GMT</div>
            <div className="font-mono text-xl font-bold text-foreground tracking-wide">
              {gmtTime}
            </div>
          </div>
        </Card>
        
        <Card className="glass-widget glass-widget-hover rounded-xl p-3 shadow-lg">
          <div className="text-center space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase">LMT</div>
            <div className="font-mono text-xl font-bold text-foreground tracking-wide">
              {lmtTime}
            </div>
          </div>
        </Card>
        
        <Card className="glass-widget glass-widget-hover rounded-xl p-3 shadow-lg">
          <div className="text-center space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase">ZT</div>
            <div className="font-mono text-xl font-bold text-foreground tracking-wide">
              {ztTime}
            </div>
          </div>
        </Card>
      </div>

      {/* Sunrise & Sunset Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-5 shadow-lg cursor-pointer group"
          onClick={() => navigate("/sunrise-times")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative space-y-3">
            <div className="flex items-center justify-center">
              <div className="relative">
                <Sunrise className="h-12 w-12 text-orange-500 animate-float" />
                <div className="absolute inset-0 blur-xl opacity-40">
                  <Sunrise className="h-12 w-12 text-orange-500" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Gündoğumu
              </div>
              <div className="font-mono text-2xl font-bold text-foreground">
                {sunriseTime}
              </div>
            </div>
            <div className="h-0.5 w-16 mx-auto rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />
          </div>
        </Card>

        <Card
          className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-5 shadow-lg cursor-pointer group"
          onClick={() => navigate("/sunset-times")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative space-y-3">
            <div className="flex items-center justify-center">
              <div className="relative">
                <Sunset className="h-12 w-12 text-indigo-500 animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 blur-xl opacity-40">
                  <Sunset className="h-12 w-12 text-indigo-500" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Günbatımı
              </div>
              <div className="font-mono text-2xl font-bold text-foreground">
                {sunsetTime}
              </div>
            </div>
            <div className="h-0.5 w-16 mx-auto rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TimeWidgets;

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
    <div className="grid grid-cols-2 gap-4" data-widget-container>
      {/* TRT Card */}
      <Card className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-4 shadow-lg aspect-square flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative text-center space-y-2 w-full">
          <Clock className="h-6 w-6 text-primary mx-auto animate-pulse" />
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">TRT</div>
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground animate-neon-glow">
            {trtTime}
          </div>
        </div>
      </Card>

      {/* GMT Card */}
      <Card className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-4 shadow-lg aspect-square flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative text-center space-y-2 w-full">
          <Clock className="h-6 w-6 text-primary mx-auto" />
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">GMT</div>
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
            {gmtTime}
          </div>
        </div>
      </Card>

      {/* LMT Card */}
      <Card className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-4 shadow-lg aspect-square flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative text-center space-y-2 w-full">
          <Clock className="h-6 w-6 text-primary mx-auto" />
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">LMT</div>
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
            {lmtTime}
          </div>
        </div>
      </Card>

      {/* ZT Card */}
      <Card className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-4 shadow-lg aspect-square flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative text-center space-y-2 w-full">
          <Clock className="h-6 w-6 text-primary mx-auto" />
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">ZT</div>
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
            {ztTime}
          </div>
        </div>
      </Card>

      {/* Sunrise Card */}
      <Card
        className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-4 shadow-lg aspect-square flex flex-col items-center justify-center cursor-pointer group"
        onClick={() => navigate("/sunrise-times")}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative text-center space-y-2 w-full">
          <div className="relative mx-auto w-fit">
            <Sunrise className="h-8 w-8 text-orange-500 animate-float" />
            <div className="absolute inset-0 blur-lg opacity-40">
              <Sunrise className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gündoğumu</div>
          <div className="font-mono text-2xl font-bold text-foreground">{sunriseTime}</div>
        </div>
      </Card>

      {/* Sunset Card */}
      <Card
        className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-4 shadow-lg aspect-square flex flex-col items-center justify-center cursor-pointer group"
        onClick={() => navigate("/sunset-times")}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative text-center space-y-2 w-full">
          <div className="relative mx-auto w-fit">
            <Sunset className="h-8 w-8 text-indigo-500 animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-0 blur-lg opacity-40">
              <Sunset className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Günbatımı</div>
          <div className="font-mono text-2xl font-bold text-foreground">{sunsetTime}</div>
        </div>
      </Card>
    </div>
  );
};

export default TimeWidgets;

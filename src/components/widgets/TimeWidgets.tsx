import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Sunrise, Sunset } from "lucide-react";

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
    <div className="space-y-4">
      {/* Digital Clocks Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="relative text-center">
            <div className="text-xs font-medium text-muted-foreground mb-1">TRT</div>
            <div className="font-mono text-2xl font-bold tracking-widest text-foreground">
              {trtTime}
            </div>
          </div>
        </Card>
        
        <Card className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="relative text-center">
            <div className="text-xs font-medium text-muted-foreground mb-1">GMT</div>
            <div className="font-mono text-2xl font-bold tracking-widest text-foreground">
              {gmtTime}
            </div>
          </div>
        </Card>
        
        <Card className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="relative text-center">
            <div className="text-xs font-medium text-muted-foreground mb-1">LMT</div>
            <div className="font-mono text-2xl font-bold tracking-widest text-foreground">
              {lmtTime}
            </div>
          </div>
        </Card>
        
        <Card className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="relative text-center">
            <div className="text-xs font-medium text-muted-foreground mb-1">ZT</div>
            <div className="font-mono text-2xl font-bold tracking-widest text-foreground">
              {ztTime}
            </div>
          </div>
        </Card>
      </div>

      {/* Sunrise & Sunset Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card
          className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => navigate("/sunrise-times")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <Sunrise className="h-6 w-6 text-orange-500 drop-shadow-sm" />
              <div className="absolute inset-0 animate-pulse opacity-20">
                <Sunrise className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Gündoğumu</div>
              <div className="text-lg font-bold text-foreground">{sunriseTime}</div>
            </div>
          </div>
        </Card>

        <Card
          className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => navigate("/sunset-times")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <Sunset className="h-6 w-6 text-indigo-500 drop-shadow-sm" />
              <div className="absolute inset-0 animate-pulse opacity-20">
                <Sunset className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Günbatımı</div>
              <div className="text-lg font-bold text-foreground">{sunsetTime}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TimeWidgets;

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
        <Card className="bg-white border-blue-200 p-4">
          <div className="text-center">
            <div className="text-xs text-blue-600 mb-1">TRT</div>
            <div className="text-2xl font-bold text-blue-600 font-mono">
              {trtTime}
            </div>
          </div>
        </Card>
        
        <Card className="bg-white border-blue-200 p-4">
          <div className="text-center">
            <div className="text-xs text-blue-600 mb-1">GMT</div>
            <div className="text-2xl font-bold text-blue-600 font-mono">
              {gmtTime}
            </div>
          </div>
        </Card>
        
        <Card className="bg-white border-blue-200 p-4">
          <div className="text-center">
            <div className="text-xs text-blue-600 mb-1">LMT</div>
            <div className="text-2xl font-bold text-blue-600 font-mono">
              {lmtTime}
            </div>
          </div>
        </Card>
        
        <Card className="bg-white border-blue-200 p-4">
          <div className="text-center">
            <div className="text-xs text-blue-600 mb-1">ZT</div>
            <div className="text-2xl font-bold text-blue-600 font-mono">
              {ztTime}
            </div>
          </div>
        </Card>
      </div>

      {/* Sunrise & Sunset Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card
          className="bg-white border-blue-200 p-4 cursor-pointer transition-all"
          onClick={() => navigate("/sunrise-times")}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 mb-1">Gündoğumu</div>
              <div className="text-xl font-bold text-blue-600">{sunriseTime}</div>
            </div>
            <Sunrise className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card
          className="bg-white border-blue-200 p-4 cursor-pointer transition-all"
          onClick={() => navigate("/sunset-times")}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 mb-1">Günbatımı</div>
              <div className="text-xl font-bold text-blue-600">{sunsetTime}</div>
            </div>
            <Sunset className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TimeWidgets;

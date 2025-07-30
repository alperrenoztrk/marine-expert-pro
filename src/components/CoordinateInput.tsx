import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CoordinateInputProps {
  label: string;
  value: number; // Still receives decimal degrees
  onChange: (value: number) => void; // Still outputs decimal degrees
  placeholder?: string;
  type: 'latitude' | 'longitude';
  className?: string;
}

// Utility functions for DMS conversion
const decimalToDMS = (decimal: number) => {
  const absoluteDecimal = Math.abs(decimal);
  const degrees = Math.floor(absoluteDecimal);
  const minutesFloat = (absoluteDecimal - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60);
  
  return { degrees, minutes, seconds };
};

const dmsToDecimal = (degrees: number, minutes: number, seconds: number, direction: string) => {
  const decimal = degrees + (minutes / 60) + (seconds / 3600);
  const multiplier = (direction === 'N' || direction === 'E') ? 1 : -1;
  return decimal * multiplier;
};

export const CoordinateInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type, 
  className = "" 
}: CoordinateInputProps) => {
  // Convert decimal degrees to DMS
  const dms = decimalToDMS(value);
  const [degrees, setDegrees] = useState(dms.degrees);
  const [minutes, setMinutes] = useState(dms.minutes);
  const [seconds, setSeconds] = useState(dms.seconds);
  const [direction, setDirection] = useState(
    type === 'latitude' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W')
  );

  // Update internal state when value prop changes
  useEffect(() => {
    const newDMS = decimalToDMS(value);
    setDegrees(newDMS.degrees);
    setMinutes(newDMS.minutes);
    setSeconds(newDMS.seconds);
    setDirection(type === 'latitude' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W'));
  }, [value, type]);

  const updateValue = (newDegrees: number, newMinutes: number, newSeconds: number, newDirection: string) => {
    // Validate ranges
    const validDegrees = Math.max(0, Math.min(newDegrees, type === 'latitude' ? 90 : 180));
    const validMinutes = Math.max(0, Math.min(newMinutes, 59));
    const validSeconds = Math.max(0, Math.min(newSeconds, 59));
    
    const decimalValue = dmsToDecimal(validDegrees, validMinutes, validSeconds, newDirection);
    onChange(decimalValue);
  };

  const handleDegreesChange = (newDegrees: number) => {
    setDegrees(newDegrees);
    updateValue(newDegrees, minutes, seconds, direction);
  };

  const handleMinutesChange = (newMinutes: number) => {
    setMinutes(newMinutes);
    updateValue(degrees, newMinutes, seconds, direction);
  };

  const handleSecondsChange = (newSeconds: number) => {
    setSeconds(newSeconds);
    updateValue(degrees, minutes, newSeconds, direction);
  };

  const handleDirectionChange = (newDirection: string) => {
    setDirection(newDirection);
    updateValue(degrees, minutes, seconds, newDirection);
  };

  const getDirectionButtons = () => {
    if (type === 'latitude') {
      return [
        { label: 'N', value: 'N', variant: (direction === 'N' ? 'default' : 'outline') as 'default' | 'outline' },
        { label: 'S', value: 'S', variant: (direction === 'S' ? 'default' : 'outline') as 'default' | 'outline' }
      ];
    } else {
      return [
        { label: 'E', value: 'E', variant: (direction === 'E' ? 'default' : 'outline') as 'default' | 'outline' },
        { label: 'W', value: 'W', variant: (direction === 'W' ? 'default' : 'outline') as 'default' | 'outline' }
      ];
    }
  };

  const formatDMS = () => {
    const degreesPadded = degrees.toString().padStart(2, '0');
    const minutesPadded = minutes.toString().padStart(2, '0');
    const secondsPadded = seconds.toString().padStart(2, '0');
    return `${degreesPadded}°${minutesPadded}'${secondsPadded}'' ${direction}`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {/* DMS Input Fields */}
      <div className="flex gap-1 items-center">
        {/* Degrees */}
        <Input
          type="number"
          value={degrees}
          onChange={(e) => handleDegreesChange(parseInt(e.target.value) || 0)}
          placeholder="00"
          className="w-16 text-center"
          min="0"
          max={type === 'latitude' ? "90" : "180"}
        />
        <span className="text-sm font-medium">°</span>
        
        {/* Minutes */}
        <Input
          type="number"
          value={minutes}
          onChange={(e) => handleMinutesChange(parseInt(e.target.value) || 0)}
          placeholder="00"
          className="w-16 text-center"
          min="0"
          max="59"
        />
        <span className="text-sm font-medium">'</span>
        
        {/* Seconds */}
        <Input
          type="number"
          value={seconds}
          onChange={(e) => handleSecondsChange(parseInt(e.target.value) || 0)}
          placeholder="00"
          className="w-16 text-center"
          min="0"
          max="59"
        />
        <span className="text-sm font-medium">''</span>
        
        {/* Direction Buttons */}
        <div className="flex gap-1 ml-2">
          {getDirectionButtons().map((button) => (
            <Button
              key={button.value}
              variant={button.variant}
              size="sm"
              onClick={() => handleDirectionChange(button.value)}
              className="w-10 h-10 p-0"
              type="button"
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Display formatted result */}
      <div className="text-xs text-gray-500">
        Format: {formatDMS()} = {value.toFixed(4)}°
      </div>
    </div>
  );
};
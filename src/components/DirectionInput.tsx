import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseSignedAngleEW } from "@/utils/angleParsing";

interface DirectionInputProps {
  label: string;
  value: number; // Still receives decimal degrees
  onChange: (value: number) => void; // Still outputs decimal degrees
  placeholder?: string;
  className?: string;
}

export const DirectionInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  className = "" 
}: DirectionInputProps) => {
  const [absoluteValue, setAbsoluteValue] = useState(Math.abs(value));
  const [direction, setDirection] = useState(value >= 0 ? 'E' : 'W');

  // Update internal state when value prop changes
  useEffect(() => {
    setAbsoluteValue(Math.abs(value));
    setDirection(value >= 0 ? 'E' : 'W');
  }, [value]);

  const updateValue = (newAbsoluteValue: number, newDirection: string) => {
    const multiplier = newDirection === 'E' ? 1 : -1;
    const finalValue = newAbsoluteValue * multiplier;
    onChange(finalValue);
  };

  const handleTextChange = (raw: string) => {
    const parsed = parseSignedAngleEW(raw);
    if (!Number.isFinite(parsed)) {
      setAbsoluteValue(Number.NaN);
      updateValue(Number.NaN, direction);
      return;
    }

    const nextDirection = parsed < 0 ? "W" : parsed > 0 ? "E" : direction;
    const nextAbs = Math.abs(parsed);
    setDirection(nextDirection);
    setAbsoluteValue(nextAbs);
    updateValue(nextAbs, nextDirection);
  };

  const handleDirectionChange = (newDirection: string) => {
    setDirection(newDirection);
    updateValue(absoluteValue, newDirection);
  };

  const getDirectionButtons = () => {
    return [
      { label: 'E', value: 'E', variant: (direction === 'E' ? 'default' : 'outline') as 'default' | 'outline' },
      { label: 'W', value: 'W', variant: (direction === 'W' ? 'default' : 'outline') as 'default' | 'outline' }
    ];
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          inputMode="decimal"
          value={Number.isFinite(absoluteValue) ? absoluteValue : ""}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-right"
          min="0"
          max="180"
        />
        <div className="flex gap-1">
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
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Sonuç: {absoluteValue.toFixed(1)}° {direction} = {value.toFixed(1)}°
      </div>
    </div>
  );
};
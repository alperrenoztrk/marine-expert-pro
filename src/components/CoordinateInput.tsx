import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CoordinateInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  type: 'latitude' | 'longitude';
  className?: string;
}

export const CoordinateInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type, 
  className = "" 
}: CoordinateInputProps) => {
  const [absoluteValue, setAbsoluteValue] = useState(Math.abs(value));
  const [direction, setDirection] = useState(
    type === 'latitude' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W')
  );

  const updateValue = (newAbsoluteValue: number, newDirection: string) => {
    const multiplier = (newDirection === 'N' || newDirection === 'E') ? 1 : -1;
    const finalValue = newAbsoluteValue * multiplier;
    onChange(finalValue);
  };

  const handleValueChange = (newValue: number) => {
    setAbsoluteValue(newValue);
    updateValue(newValue, direction);
  };

  const handleDirectionChange = (newDirection: string) => {
    setDirection(newDirection);
    updateValue(absoluteValue, newDirection);
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

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="number"
          step="0.0001"
          value={absoluteValue}
          onChange={(e) => handleValueChange(parseFloat(e.target.value) || 0)}
          placeholder={placeholder}
          className="flex-1 text-right"
          min="0"
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
      <div className="text-xs text-gray-500">
        Sonuç: {value.toFixed(4)}° ({direction === 'N' || direction === 'E' ? 'Pozitif' : 'Negatif'})
      </div>
    </div>
  );
};
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DMSCoordinate } from "@/utils/coordinateUtils";

interface CoordinateInputProps {
  label: string;
  value: DMSCoordinate;
  onChange: (value: DMSCoordinate) => void;
  isLatitude: boolean;
  id?: string;
}

export function CoordinateInput({ label, value, onChange, isLatitude, id }: CoordinateInputProps) {
  const directions = isLatitude ? ['N', 'S'] : ['E', 'W'];
  const maxDegrees = isLatitude ? 90 : 180;

  const handleDegreesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const deg = parseInt(e.target.value) || 0;
    if (deg >= 0 && deg <= maxDegrees) {
      onChange({ ...value, degrees: deg });
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value) || 0;
    if (min >= 0 && min < 60) {
      onChange({ ...value, minutes: min });
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sec = parseFloat(e.target.value) || 0;
    if (sec >= 0 && sec < 60) {
      onChange({ ...value, seconds: Math.round(sec * 10) / 10 });
    }
  };

  const handleDirectionChange = (dir: string) => {
    onChange({ ...value, direction: dir as 'N' | 'S' | 'E' | 'W' });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} data-translatable>{label}</Label>
      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-2">
        <div className="relative">
          <Input
            id={id}
            type="number"
            min="0"
            max={maxDegrees}
            value={value.degrees}
            onChange={handleDegreesChange}
            className="pr-6"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">°</span>
        </div>
        <div className="relative">
          <Input
            type="number"
            min="0"
            max="59"
            value={value.minutes}
            onChange={handleMinutesChange}
            className="pr-6"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">'</span>
        </div>
        <div className="relative">
          <Input
            type="number"
            min="0"
            max="59.9"
            step="0.1"
            value={value.seconds}
            onChange={handleSecondsChange}
            className="pr-6"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">"</span>
        </div>
        <Select value={value.direction} onValueChange={handleDirectionChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {directions.map((dir) => (
              <SelectItem key={dir} value={dir}>
                {dir}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

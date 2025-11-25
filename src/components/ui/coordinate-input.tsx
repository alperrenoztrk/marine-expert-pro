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
    const val = e.target.value.replace(',', '.');
    if (val === '') {
      onChange({ ...value, degrees: 0 });
      return;
    }
    const deg = parseInt(val);
    if (!isNaN(deg) && deg >= 0 && deg <= maxDegrees) {
      onChange({ ...value, degrees: deg });
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(',', '.');
    if (val === '') {
      onChange({ ...value, minutes: 0 });
      return;
    }
    const min = parseInt(val);
    if (!isNaN(min) && min >= 0 && min < 60) {
      onChange({ ...value, minutes: min });
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(',', '.');
    if (val === '') {
      onChange({ ...value, seconds: 0 });
      return;
    }
    const sec = parseFloat(val);
    if (!isNaN(sec) && sec >= 0 && sec < 60) {
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
            type="text"
            inputMode="numeric"
            placeholder=""
            value={value.degrees || ''}
            onChange={handleDegreesChange}
            className="pr-6"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">°</span>
        </div>
        <div className="relative">
          <Input
            type="text"
            inputMode="numeric"
            placeholder=""
            value={value.minutes || ''}
            onChange={handleMinutesChange}
            className="pr-6"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">'</span>
        </div>
        <div className="relative">
          <Input
            type="text"
            inputMode="numeric"
            placeholder=""
            value={value.seconds || ''}
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

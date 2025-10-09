import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sunset as SunsetIcon, MapPin } from "lucide-react";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";

type SunsetDay = {
  date: string;
  sunset: string | null;
};

function formatDateTr(dateStr: string): string {
  const date = new Date(dateStr);
  const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const dayName = dayNames[date.getDay()];
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${dayName} ${d}.${m}.${date.getFullYear()}`;
}

function hhmmFromIso(isoLike?: string | null): string {
  if (!isoLike) return "-";
  const m = isoLike.match(/T?(\d{2}):(\d{2})/);
  if (m) return `${m[1]}:${m[2]}`;
  try {
    const d = new Date(isoLike);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  } catch {
    return "-";
  }
}

export default function SunsetTimes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: current, locationLabel } = useCurrentWeather({ watchPosition: false, reverseGeocode: true });

  const latParam = Number(searchParams.get("lat"));
  const lonParam = Number(searchParams.get("lon"));

  const latitude = useMemo(() => (Number.isFinite(latParam) ? latParam : current?.latitude), [latParam, current?.latitude]);
  const longitude = useMemo(() => (Number.isFinite(lonParam) ? lonParam : current?.longitude), [lonParam, current?.longitude]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<SunsetDay[]>([]);

  const fetchSunsets = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const start = new Date();
      const end = new Date(start);
      end.setDate(start.getDate() + 29); // 30 gün (bugün dahil)
      const fmt = (d: Date) => d.toISOString().slice(0, 10);

      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.searchParams.set("latitude", String(lat));
      url.searchParams.set("longitude", String(lon));
      url.searchParams.set("daily", "sunset");
      url.searchParams.set("timezone", "auto");
      url.searchParams.set("start_date", fmt(start));
      url.searchParams.set("end_date", fmt(end));

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Veri alınamadı (${res.status})`);
      const json = await res.json();
      const daily = json.daily || {};
      const list: SunsetDay[] = (daily.time || []).map((date: string, i: number) => ({
        date,
        sunset: daily.sunset?.[i] ?? null,
      }));
      setDays(list);
    } catch (e: any) {
      setError(e?.message || "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof latitude === "number" && typeof longitude === "number") {
      fetchSunsets(latitude, longitude);
    }
  }, [latitude, longitude, fetchSunsets]);

  const selectedLocationName = searchParams.get("location");
  const headerLocation = selectedLocationName || locationLabel || (typeof latitude === "number" && typeof longitude === "number" ? `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°` : "Konum alınıyor...");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-card p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Button>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <SunsetIcon className="h-6 w-6 text-indigo-500" />
            30 Günlük Günbatımı Saatleri
          </h1>
          <div></div>
        </div>

        <Card className="border-border/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{headerLocation}</span>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card className="border-border/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <div className="relative">
                  <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </div>
                <p className="text-muted-foreground">Günbatımı saatleri yükleniyor...</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-destructive/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-destructive font-semibold mb-2">Veri alınamadı</p>
                <p className="text-muted-foreground text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : days.length > 0 ? (
          <Card className="border-border/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Önümüzdeki 30 Gün</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {days.map((d) => (
                  <div key={d.date} className="flex items-center justify-between p-3 rounded-lg border border-border/10 hover:bg-accent/5 transition-colors">
                    <div className="text-sm font-medium text-foreground">{formatDateTr(d.date)}</div>
                    <div className="text-base font-semibold text-foreground">
                      {hhmmFromIso(d.sunset)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
